const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

router.route('/').get(getAll('country'))

router.route('/:id').get(getById('country'))

module.exports = {
    default: router
}