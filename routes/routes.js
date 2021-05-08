const express = require('express')
const controller = require('../controllers/dashboardControllers.js')
const auth = require('../models/authenticateModel')
const { ensureLoggedIn } = require('connect-ensure-login')

const router = express.Router()

router.get('/', controller.login)
router.get('/Register', controller.register)
router.get('/Logout', controller.logout)
router.get('/Dashboard', ensureLoggedIn('/'), controller.dashboard)
router.get('/New-Week', controller.notImplemented)
router.get('/Edit-Week', ensureLoggedIn('/'), controller.editWeek)
router.get('/Upcoming', controller.notImplemented)
router.get('/Previous', controller.notImplemented)
router.get('/Plan', controller.planNew)
router.get('/Share', controller.notImplemented)
router.get('/TestData', controller.notImplemented)
router.get('/Remove-Event', ensureLoggedIn('/'), controller.removeEvent)

router.post('/', auth.authorize('/'), controller.postLogin)
router.post('/Register', controller.postRegister)
router.post('/Edit-Week', controller.postEditWeek)
router.post('/Remove-Event', controller.postRemoveEvent)

router.use(function(req, res) {
    res.status(404)
    res.type('text/plain')
    res.send('Error 404: Page not found.')
})

router.use(function(req, res) {
    res.status(500)
    res.type('text/plain')
    res.send('Error 500: Internal Server Error.')
})

module.exports = router