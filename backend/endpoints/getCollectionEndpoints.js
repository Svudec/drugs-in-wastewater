const { Router } = require('express')
const { executeQuery, executeQueryCopy, sendResponseGet } = require('../queries')
const router = Router()

const getCollection = `select 
me.id measurement_id,
year measurement_year,
m.name metabolite_name,
country_code,
c2.name country_name,
long_name country_long_name,
c.name city_name,
i.name institution_name,
website institutuion_website,
location_id,
l.name location_name,
latitude location_latitude,
longitude location_longitude,
geom location_geom,
population_size location_population_size,
dayofweek measurement_dayofweek,
value measurement_value
from
     measurement me
     join metabolite m on m.id = me.metabolite_id
     join location l on me.location_id = l.id
     join city c on c.id = l.city_id
     join country c2 on c.country_id = c2.country_code
     join institution i on l.institution_id = i.id
order by measurement_year DESC, metabolite_name, country_name,
         city_name, institution_name, location_population_size DESC, measurement_dayofweek`

const generateCsv = `COPY (select year measurement_year,
            m.name metabolite_name,
            country_code,
            c2.name country_name,
            long_name country_long_name,
            c.name city_name,
            i.name institution_name,
            website institutuion_website,
            location_id,
            l.name location_name,
            latitude location_latitude,
            longitude location_longitude,
            geom location_geom,
            population_size location_population_size,
            dayofweek measurement_dayofweek,
            value measurement_value
            from
                 measurement me
                 join metabolite m on m.id = me.metabolite_id
                 join location l on me.location_id = l.id
                 join city c on c.id = l.city_id
                 join country c2 on c.country_id = c2.country_code
                 join institution i on l.institution_id = i.id
            order by measurement_year DESC, metabolite_name, country_name,
                     city_name, institution_name, location_population_size DESC, measurement_dayofweek)
         TO STDOUT WITH DELIMITER ',' CSV HEADER`

const generateJson = `COPY (SELECT
    json_build_object(
        'countries', json_agg(
            json_build_object(
                'country_code', c.country_code,
                'name', c.name,
                'long_name', c.long_name,
                'cities', cities
                )
            )
        ) countries
        from country c
        left join (
            select ci.country_id,
                   json_agg(
                       json_build_object(
                           'id', ci.id,
                           'name', ci.name,
                           'locations', locations
                           )
                       ) cities
                from city ci
                left join (
                    select l.city_id,
                    json_agg(
                        json_build_object(
                            'id', l.id,
                            'name', l.name,
                            'population_size', l.population_size,
                            'latitude', l.latitude,
                            'longitude', l.longitude,
                            'geom', l.geom,
                            'institution', institution,
                            'measurements', measurements
                            )
                        ) locations
                    from location l
                    left join (
                        select m.location_id,
                               json_agg(
                                   json_build_object(
                                       'id', m.id,
                                       'year', m.year,
                                       'dayofweek', m.dayofweek,
                                       'value', m.value,
                                       'metabolite', metabolite
                                       )
                                   ) measurements
                        from measurement m
                        left join (
                            select me.id,
                                   json_build_object(
                                       'id', me.id,
                                       'name', me.name
                                       ) metabolite
                            from metabolite me
                        ) me on me.id = m.metabolite_id
                        group by m.location_id
                    ) m on m.location_id = l.id
                    left join (
                        select i.id,
                               json_build_object(
                                   'id', i.id,
                                   'name', i.name,
                                   'website', i.website
                                   ) institution
                        from institution i
                    ) i on i.id = l.institution_id
                    group by l.city_id
                ) l on ci.id = l.city_id
                group by ci.country_id
        ) ci on c.country_code = ci.country_id)
    TO STDOUT`


router.route(`/api/v1/collection`).get(async (req, res) => {
    const queryRes = await executeQuery(getCollection)
    sendResponseGet(queryRes, res)
})

router.route(`/api/v1/collection`).put((req, res) => {
    executeQueryCopy(generateCsv, 'exported/drugs-in-wastewater.csv').then(s => {
        executeQueryCopy(generateJson, 'exported/drugs-in-wastewater.json').then(s1 => {
            res.status(200).json({ status: 'ok', message: 'Static files refreshed.' })
        })
            .catch(err => {
                res.status(500).json({ status: 'error', message: err.message })
            })
    })
        .catch(err => {
            res.status(500).json({ status: 'error', message: err.message })
        })
})

module.exports = {
    default: router
}