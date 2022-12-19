const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

const getAllByCountryCode = (countryCode) => ({
    text: `select l.* 
    from location l 
        join city c on l.city_id = c.id
        join country co on c.country_id = co.country_code
        where co.country_code = $1`, 
        values: [countryCode]
})

router.route(`/api/v1/location`).get(getAll('location'))

router.route(`/api/v1/location/:id`).get(getById('location'))

router.route(`/api/v1/location/by-country/:countryCode`).get(async (req, res) => {
    const queryRes = await executeQuery(getAllByCountryCode(req.params.countryCode))
    sendResponseGet(queryRes, res)
})

module.exports = {
    default: router
}