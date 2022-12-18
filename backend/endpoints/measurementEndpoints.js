const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

router.route('/').get(getAll('measurement'))

router.route('/:id').get(getById('measurement'))

module.exports = {
    default: router
}