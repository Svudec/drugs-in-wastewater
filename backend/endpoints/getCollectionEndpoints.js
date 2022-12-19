const { Router } = require('express')
const { executeQuery, sendResponseGet } = require('../queries')
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


router.route(`/api/v1/collection`).get(async (req, res) => {
    const queryRes = await executeQuery(getCollection)
    sendResponseGet(queryRes, res)
})

module.exports = {
    default: router
}