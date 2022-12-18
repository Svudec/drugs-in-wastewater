const { Router } = require('express')
const { executeQuery, sendResponseGet, getAll, getById } = require('../queries')
const router = Router()

router.route('/').get(getAll('metabolite'))

router.route('/:id').get(getById('metabolite'))

module.exports = {
    default: router
}