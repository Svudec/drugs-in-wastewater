const { Router } = require('express')
const { getAll, getById } = require('../queries')
const router = Router()

router.route(`/api/v1/city`).get(getAll('city'))

router.route(`/api/v1/city/:id`).get(getById('city'))

module.exports = {
    default: router
}