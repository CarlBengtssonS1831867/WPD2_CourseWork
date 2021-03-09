const express = require('express')
// const nedb = require('nedb')
const mustache = require('mustache-express')
const router = require('./routes/routes.js')

const app = express()

app.engine('mustache', mustache())
app.set('view engine', 'mustache')

app.use(express.urlencoded({extended: false}))
app.use('/', router)

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^C to quit.')
})