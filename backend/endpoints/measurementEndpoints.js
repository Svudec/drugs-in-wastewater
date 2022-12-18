const { Router } = require('express')
const {executeQuery} = require('../queries')
const router = Router()

const getAll = `select * from measurement`

const getById = (id) => ({
    text: `select * from measurement where id = $1`, values: [id]
})

router.route('/').get(async (req, res) => {
    const queryRes = await executeQuery(getAll)

    if (queryRes.status === 'error') {
        res.status(500).json({ message: "Moj error" })
    } else {
        res.status(200).json(queryRes.res)
    }
})

router.route('/:id').get(async (req, res) => {
    const queryRes = await executeQuery(getById(req.params.id))

    if (queryRes.status === 'error') {
        res.status(500).json({ message: "Moj error" })
    } else {
        res.status(200).json(queryRes.res)
    }
})

module.exports={
    default: router
}