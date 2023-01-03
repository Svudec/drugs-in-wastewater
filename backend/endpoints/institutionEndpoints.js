const { Router } = require('express')
const { getById, executeQuery, sendResponseGet } = require('../queries')
const router = Router()

const getWithCountriesQuery = `
select distinct i.*, co.country_code country_code, co.long_name country
from location l
    join institution i on l.institution_id = i.id
    join city c on l.city_id = c.id
    join country co on c.country_id = co.country_code
order by country_code`

router.route(`/api/v1/institution`).get(async (req, res) => {
    const queryRes = await executeQuery(getWithCountriesQuery)
    sendResponseGet(queryRes, res)
})

router.route(`/api/v1/institution/:id`).get(getById('institution'))

module.exports = {
    default: router
}