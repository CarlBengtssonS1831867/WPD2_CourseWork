const databaseDAO = require('../models/dashboardModel')
const db = new databaseDAO('database.db')
const userModel = require('../models/userModel')

exports.login = function(req, res) {
    res.render('login', {
        title: 'Login',
        'login-error': req.flash('error')
    })
}

exports.register = function(req, res) {
    res.render('register', {
        title: 'Register'
    })
}

exports.dashboard = function(req, res) {
    console.log(req.user)
    res.sendFile(public + '/dashboard.html')
}

exports.editWeek = function(req, res) {
    res.sendFile(public + '/edit-week.html')
}

exports.plan = function(req, res) {

    db.selectAllEntries().then((list) => {
        
        var monday = [], tuesday = [], wednesday = [], thursday = [], friday = [], saturday = [], sunday = []
        
        list.forEach(element => {
            var date = element.date.toISOString()
            switch(date) {
                case '2021-03-08T00:00:00.000Z':
                    monday.push(element)
                    break
                case '2021-03-09T00:00:00.000Z':
                    tuesday.push(element)
                    break
                case '2021-03-10T00:00:00.000Z':
                    wednesday.push(element)
                    break
                case '2021-03-11T00:00:00.000Z':
                    thursday.push(element)
                    break
                case '2021-03-12T00:00:00.000Z':
                    friday.push(element)
                    break
                case '2021-03-13T00:00:00.000Z':
                    saturday.push(element)
                    break
                case '2021-03-14T00:00:00.000Z':
                    sunday.push(element)
                    break
            }
        })

        res.render('plan', {
            'title': 'Plan',
            'Monday': monday,
            'Tuesday': tuesday,
            'Wednesday': wednesday,
            'Thursday': thursday,
            'Friday': friday,
            'Saturday': saturday,
            'Sunday': sunday
        })
    })
    
    /* wednesday = db.selectEntriesOnDate(new Date('10 Mar 2021'))
    thursday = db.selectEntriesOnDate(new Date('11 Mar 2021'))
    friday = db.selectEntriesOnDate(new Date('12 Mar 2021'))
    saturday = db.selectEntriesOnDate(new Date('13 Mar 2021'))
    sunday = db.selectEntriesOnDate(new Date('14 Mar 2021')) */

    // console.log(Monday)

    /* res.render('plan', {
        'title': 'Plan',
        'Monday': monday,
        'Tuseday': tuesday,
        'Wednesday': wednesday,
        'Thursday': thursday,
        'Friday': friday,
        'Saturday': saturday,
        'Sunday': sunday
    }) */

    //res.sendFile(public + '/plan.html')
}

exports.removeEvent = function(req, res) {
    db.selectAllEntries().then((list) => {
        res.render('removeEvent', {
            'title': 'Remove Event',
            'events': list,
            /* 'day': function() {
                var day = list.date.split(" ")
                return String.concat(day[0], day[1], day[2])
            } */
        })
    })
}

//Post Methods

exports.postLogin = function(req, res) {
    res.redirect('/Dashboard')
}

exports.postRegister = function(req, res) {
    if (!req.body.username || !req.body.password || req.body.password.length < 8) {
        res.render('register', {
            title: 'Register',
            'register-error': 'Invalid Username or Password, please try again.'
        })
        return
    }

    userModel.findUser(req.body.username, (err, user) => {
        if(user) {
            console.log('user already exists')
            res.render('register', {
                title: 'Register',
                'register-error': 'Username already exists, please choose another username.'
            })
            return
        }
        console.log('user OK to register')
        userModel.newUser(req.body.username, req.body.password)
        res.redirect('/')
    })
}

exports.postEditWeek = function(req, res) {
    db.insertNewActivity(req.body.Date, req.body.Activity, req.body.Number, req.body.Unit)
    res.redirect('/Plan')
}

exports.postRemoveEvent = function(req, res) {
    db.removeEntry(req.body.event)
    res.redirect('/Plan')
}

//Not Implemented Method
exports.notImplemented = function(req, res) {
    res.send('<h1>Not yet implemented</h1>')
}