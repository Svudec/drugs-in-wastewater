const { Router } = require('express')
const {executeQuery, getAll} = require('../queries')
const router = Router()

router.route('/').get(executeQuery(getAll))

module.exports={
    default: router
}