const express = require('express')
const controller = require('../controllers/dashboardControllers.js')

const router = express.Router()

router.get('/', controller.login)
router.get('/Dashboard', controller.dashboard)
router.get('/New-Week', controller.notImplemented)
router.get('/Edit-Week', controller.editWeek)
router.get('/Upcoming', controller.notImplemented)
router.get('/Previous', controller.notImplemented)
router.get('/Plan', controller.plan)
router.get('/Share', controller.notImplemented)
router.get('/TestData', controller.notImplemented)

router.post('/Edit-Week', controller.postEditWeek)

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