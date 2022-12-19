const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

const getAvgValues = (metaboliteId, year) => ({
    text: `select c2.*, avg(value) value
    from measurement m
        join metabolite m2
            on m2.id = m.metabolite_id and m2.id = $1 ${year ? 'and year = $2' : ''}
        join location l
            on m.location_id = l.id
        join city c
            on l.city_id = c.id
        join country c2
            on c.country_id = c2.country_code
        group by c2.country_code, c2.name, c2.long_name
        order by value desc`,
    values: [metaboliteId].concat(year ? [year] : [])
})

router.route(`/api/v1/metabolite`).get(getAll('metabolite'))

router.route(`/api/v1/metabolite/:id`).get(getById('metabolite'))

router.route(`/api/v1/metabolite/avg-by-country/:id`).get(async (req, res) => {
    const queryRes = await executeQuery(getAvgValues(req.params.id))
    sendResponseGet(queryRes, res)
})

router.route(`/api/v1/metabolite/avg-by-country/:id/:year`).get(async (req, res) => {
    const queryRes = await executeQuery(getAvgValues(req.params.id, req.params.year))
    sendResponseGet(queryRes, res)
})

module.exports = {
    default: router
}