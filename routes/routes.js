const express = require('express')
const controller = require('../controllers/dashboardControllers.js')
const auth = require('../models/authenticateModel')
const { ensureLoggedIn } = require('connect-ensure-login')

const router = express.Router()

router.get('/', controller.login)
router.get('/Register', controller.register)
router.get('/Logout', controller.logout)
router.get('/Dashboard', ensureLoggedIn('/'), controller.dashboard)
router.get('/Select-Edit-Week', ensureLoggedIn('/'), controller.selectEditWeek)
router.get('/Edit-Week', ensureLoggedIn('/'), controller.editWeek)
router.get('/Plan', controller.planNew)
router.get('/Share', controller.notImplemented)
router.get('/Complete-Event', ensureLoggedIn('/'), controller.completeEvent)
router.get('/Unfinished-Goals', ensureLoggedIn('/'), controller.unfinishedGoals)

router.post('/', auth.authorize('/'), controller.postLogin)
router.post('/Register', controller.postRegister)
router.post('/New-Event', controller.postNewEvent)
router.post('/Edit-Event', controller.postEditEvent)
router.post('/Update-Event', controller.postUpdateEvent)
router.post('/Delete-Event', controller.postDeleteEvent)
router.post('/Add-New-Event', controller.postAddNewEvent)

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