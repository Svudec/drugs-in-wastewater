const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

router.route('/').get(getAll('city'))

router.route('/:id').get(getById('city'))

module.exports = {
    default: router
}