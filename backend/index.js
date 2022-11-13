const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')

const app = express()
const port = 8400

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', db.getTable)

app.listen(port, () => {
    console.log(`Backend running on port ${port}.`)
})