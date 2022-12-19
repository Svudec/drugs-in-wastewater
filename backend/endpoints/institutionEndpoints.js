const { Router } = require('express')
const { getAll, getById } = require('../queries')
const router = Router()

router.route(`/api/v1/institution`).get(getAll('institution'))

router.route(`/api/v1/institution/:id`).get(getById('institution'))

module.exports = {
    default: router
}