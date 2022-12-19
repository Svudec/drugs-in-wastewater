const { Router } = require('express')
const { executeQuery, getAll, getById, writeQuery, getByIdQuery } = require('../queries')
const router = Router()

const getMaxId = 'select max(id) last from measurement'

const addMeasurement = (o) => ({
    text: `INSERT INTO measurement(id, year, metabolite_id, location_id, dayOfWeek, value) VALUES
    ($1, $2, $3, $4, $5, $6)`,
    values: [o.id, o.year, o.metabolite_id, o.location_id, o.dayofweek, o.value]
})

const updateMeasurement = (oldM, newM) => {
    let i = 0
    const out = {
        text: `update measurement set 
    ${Object.keys(newM).filter(a => a !== 'id').map(a => { i += 1; return a + '=$' + i }).join(',')}
    where id = ${oldM.id}`,
        values: Object.keys(newM).filter(a => a !== 'id').map(a => newM[a])
    }
    return out
}

const deleteMeasurement = (id) => ({ text: "delete from measurement where id = $1", values: [id] })

router.route(`/api/v1/measurement`).get(getAll('measurement'))

router.route(`/api/v1/measurement`).post(async (req, res) => {
    const lastIdQ = await executeQuery(getMaxId, true)
    const newId = lastIdQ.res.last + 1

    const addQ = await writeQuery(addMeasurement({ ...req.body, id: newId }))

    if (addQ.status === 'error') {
        res.status(addQ.httpStatus).json(addQ)
    }
    const fakeReq = { params: { id: newId } }
    const getFn = getById('measurement', true)
    getFn(fakeReq, res)
})

router.route(`/api/v1/measurement/:id`).get(getById('measurement'))

router.route(`/api/v1/measurement/:id`).delete(async (req, res) => {
    const existing = await executeQuery(getByIdQuery('measurement', req.params.id), true)
    if (existing.status === 'error') {
        res.status(existing.httpStatus)
            .json({ ...existing, message: existing.httpStatus === 404 ? 'Requested resource not found!' : existing.message })
    }

    const deleteQ = await writeQuery(deleteMeasurement(existing.res.id))

    if (deleteQ.status === 'error') {
        res.status(deleteQ.httpStatus).json(deleteQ)
    } else {
        res.status(200).json({ ...deleteQ, message: 'Resource deleted successfully' })
    }
})

router.route(`/api/v1/measurement/:id`).put(async (req, res) => {
    const existing = await executeQuery(getByIdQuery('measurement', req.params.id), true)
    if (existing.status === 'error') {
        res.status(existing.httpStatus)
            .json({ ...existing, message: existing.httpStatus === 404 ? 'Requested resource not found!' : existing.message })
    }

    const updateQ = await writeQuery(updateMeasurement(existing.res, req.body))

    if (updateQ.status === 'error') {
        res.status(updateQ.httpStatus).json(updateQ)
    }
    const getFn = getById('measurement', true)
    getFn(req, res)
})

module.exports = {
    default: router
}