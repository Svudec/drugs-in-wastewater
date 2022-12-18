const { Router } = require('express')
const { executeQuery, getAll, getById, writeQuery } = require('../queries')
const router = Router()

router.route('/').get(getAll('measurement'))

router.route('/:id').get(getById('measurement'))

const getMaxId = 'select max(id) last from measurement'

const addMeasurement = (id, year, metaboliteId, locationId, dayOfWeek, value) => ({
    text: `INSERT INTO measurement(id, year, metabolite_id, location_id, dayOfWeek, value) VALUES
    ($1, $2, $3, $4, $5, $6)`,
    values: [id, year, metaboliteId, locationId, dayOfWeek, value]
})

router.route('/').post(async (req, res) => {
    const lastIdQ = await executeQuery(getMaxId, true)
    const newId = lastIdQ.res.last + 1
    const b = req.body

    const addQ = await writeQuery(addMeasurement(newId, b.year, b.metaboliteId, b.locationId, b.dayOfWeek, b.value))

    if (addQ.status === 'error') {
        res.status(addQ.httpStatus).json(addQ)
    }
    const fakeReq = { params: { id: newId } }
    const getFn = getById('measurement', true)
    getFn(fakeReq, res)
})

module.exports = {
    default: router
}