const express = require('express')
const path = require('path')
const mustache = require('mustache-express')
const router = require('./routes/routes.js')
const auth = require('./models/authenticateModel')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

const app = express()
global.public = path.join(__dirname, 'public')

app.engine('mustache', mustache())
app.set('view engine', 'mustache')

app.use(express.urlencoded({extended: false}))

app.use(session({secret: 'H@YE6k#DFxIOYOa*Ffo6iN546KFAA^Nv$dvJ$Zf200hi84dYIFiYJfYaF@^C#0u&', resave: false, saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

auth.init(app)
app.use('/', router)

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^C to quit.')
})