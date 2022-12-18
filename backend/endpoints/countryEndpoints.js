const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

router.route('/').get(getAll('country'))

router.route('/:id').get(getById('country'))

const getAvgValues = (countryId, metaboliteId) => ({
    text: `select dayofweek, avg(value) value
    from measurement m
        join metabolite m2
            on m2.id = m.metabolite_id and m2.id = $2
        join location l
            on m.location_id = l.id
        join city c
            on l.city_id = c.id
        join country c2
            on c.country_id = c2.country_code and c2.country_code = $1
        group by dayofweek
        order by value desc `,
    values: [countryId, metaboliteId]
})

router.route('/top-days/:id/:metaboliteId').get(async (req, res) => {
    const queryRes = await executeQuery(getAvgValues(req.params.id, req.params.metaboliteId))
    sendResponseGet(queryRes, res)
})

module.exports = {
    default: router
}