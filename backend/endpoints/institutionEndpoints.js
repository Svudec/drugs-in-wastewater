const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

router.route('/').get(getAll('institution'))

router.route('/:id').get(getById('institution'))

module.exports = {
    default: router
}