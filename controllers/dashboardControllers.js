const databaseDAO = require('../models/dashboardModel')
const db = new databaseDAO('database.db')
const userModel = require('../models/userModel')
const weeknumber = require('weeknumber')
const { AvatarGenerator } = require('random-avatar-generator')
const generator = new AvatarGenerator()

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

exports.logout = function(req, res) {
    req.logout()
    res.redirect('/')
}

exports.dashboard = function(req, res) {
    console.log(req.user)
    res.render('dashboard', {
        title: 'Dashboard',
        username: req.user.username,
        id: req.user._id,
        avatar: generator.generateRandomAvatar(req.user._id)
    })
}

exports.selectEditWeek = function(req, res) {
    db.selectAllEntries(req.user._id).then(list => {
        res.render('selectEditWeek', {
            title: 'Select Week to Edit',
            WeekPlans: list,
            tasksNum: () => {return this.tasks.length}
        })
    })
}

exports.editWeek = function(req, res) {
    var week

    if (req.query.WeekNumber) {
        week = req.query.WeekNumber
    } else if (req.query.WeekPlan) {
        week = req.query.WeekPlan
    } else {
        res.redirect('/Plan')
        return
    }

    db.selectWeekPlan(week, req.user._id).then(entry => {
        res.render('editWeek', {
            title: 'Edit Week',
            week: week,
            taskLength: entry.tasks.length,
            tasks: entry.tasks,
            date: () => {
                if (this.weekday == 8) {return 'Week Goal'}
                return new Date(2021, 0, this.day).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})
            }
        })
    }).catch(() => {
        db.newWeekPlan(req.user._id, week).then(entry => {
            res.render('editWeek', {
                title: 'Edit Week',
                week: week,
                taskLength: entry.tasks.length
            })
        })
    })
}

exports.planNew = function(req, res) {
    if (req.query.id) {
        db.selectWeekPlanByID(req.query.id).then(entry => {
            let week = weeknumber.weekNumberYear(new Date(2021, 0, entry.week*7))
            renderPlan(req, res, entry, week)
        }).catch(() => {
            res.send(`<h1>Plan with ID: '${req.query.id}' was not found.</h1>`)
        })
    } else if (req.query.week) {
        db.selectWeekPlan(req.query.week, req.user._id).then(entry => {
            let week = weeknumber.weekNumberYear(new Date(2021, 0, entry.week*7))
            renderPlan(req, res, entry, week)
        }).catch(() => {
            let week = weeknumber.weekNumberYear(new Date(2021, 0, req.query.week*7))
            renderPlan(req, res, null, week)
        })
    } else {
        let week = weeknumber.weekNumberYear(new Date())
        db.selectWeekPlan(week.week, req.user._id).then(entry => {
            renderPlan(req, res, entry, week)
        })
    }
}

function renderPlan(req, res, entry, weekNum) {
    var week = weeknumber.weekNumberYear(new Date(weekNum.year, 0, weekNum.week*7))
    var day = weeknumber.dayOfYear(new Date(week.year, 0, week.week*7))
    var firstDay = new Date(week.year, 0, day-week.day+1).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})
    var lastDay = new Date(week.year, 0, day-week.day+7).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})

    var mon = {day: 'Monday:', tasks: []}
    var tue = {day: 'Tuesday:', tasks: []}
    var wed = {day: 'Wednesday:', tasks: []}
    var thu = {day: 'Thursday:', tasks: []}
    var fri = {day: 'Friday:', tasks: []}
    var sat = {day: 'Saturday:', tasks: []}
    var sun = {day: 'Sunday:', tasks: []}
    var weekTask = {day: 'Week tasks:', tasks: []}
    var content = []

    if (entry) {
        entry.tasks.forEach(element => {
            switch (element.weekDay) {
                case 1:
                    mon.tasks.push(element)
                    break
                case 2:
                    tue.tasks.push(element)
                    break
                case 3:
                    wed.tasks.push(element)
                    break
                case 4:
                    thu.tasks.push(element)
                    break
                case 5:
                    fri.tasks.push(element)
                    break
                case 6:
                    sat.tasks.push(element)
                    break
                case 7:
                    sun.tasks.push(element)
                    break
                case 8:
                    weekTask.tasks.push(element)
                    break
            }
        })
    }

    if (mon.tasks.length > 0) {content.push(mon)}
    if (tue.tasks.length > 0) {content.push(tue)}
    if (wed.tasks.length > 0) {content.push(wed)}
    if (thu.tasks.length > 0) {content.push(thu)}
    if (fri.tasks.length > 0) {content.push(fri)}
    if (sat.tasks.length > 0) {content.push(sat)}
    if (sun.tasks.length > 0) {content.push(sun)}
    if (weekTask.tasks.length > 0) {content.push(weekTask)}

    res.render('plan', {
        title: 'Plan',
        weekNumber: week.week,
        prevWeek: () => {return week.week-1},
        nextWeek: () => {return week.week+1},
        firstDay: firstDay,
        lastDay: lastDay,
        year: week.year,
        content: content
    })
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
    db.selectAllEntries(req.user._id).then((list) => {
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

exports.completeEvent = function(req, res) {
    db.completeEntry(req.query.week, req.user._id, req.query.taskID)
    res.redirect('/Plan')
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

exports.postNewEvent = function(req, res) {
    res.render('/newEvent', {
        title: 'New Event',
        taskLength: req.body.taskLength,
        week: req.body.week,
        mon: ()=> {new Date(2021, 0, req.body.week*7-3).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
        tue: ()=> {new Date(2021, 0, req.body.week*7-2).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
        wed: ()=> {new Date(2021, 0, req.body.week*7-1).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
        thu: ()=> {new Date(2021, 0, req.body.week*7).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
        fri: ()=> {new Date(2021, 0, req.body.week*7+1).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
        sat: ()=> {new Date(2021, 0, req.body.week*7+2).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
        sun: ()=> {new Date(2021, 0, req.body.week*7+3).toLocaleDateString(undefined, {month: 'long', day: '2-digit'})},
    })
}

exports.postEditEvent = function(req, res) {
    db.editEntry(req.body.week, req.user._id, req.body.taskID, req.body.activity, req.body.number, req.body.unit)
    res.redirect('/Plan')
}

exports.postDeleteEvent = function (req, res) {
    db.removeEntry(req.body.week, req.user._id, req.body.Task)
    res.redirect('/Plan')
}

exports.postAddNewEvent = function(req, res) {
    db.insertNewActivity(req.body.week, req.user._id, req.body.week*7-4+req.body.Date, req.body.Activity, req.body.Number, req.body.Unit, req.body.Date, req.body.taskLength)
    res.redirect('/Plan')
}

//Not Implemented Method
exports.notImplemented = function(req, res) {
    res.send('<h1>Not yet implemented</h1>')
}