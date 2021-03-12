const databaseDAO = require('../models/dashboardModel')
const db = new databaseDAO('database.db')

exports.login = function(req, res) {
    res.render('login', {
        'title': 'Login'
    })
}

exports.dashboard = function(req, res) {
    res.sendFile(public + '/dashboard.html')
}

exports.editWeek = function(req, res) {
    res.sendFile(public + '/edit-week.html')
}

exports.postEditWeek = function(req, res) {
    db.insertNewActivity(req.body.Date, req.body.Activity, req.body.Number, req.body.Unit)
    res.redirect('/Plan')
}

exports.plan = function(req, res) {

    db.selectAllEntries().then((list) => {
        
        var monday = [], tuesday = [], wednesday = [], thursday = [], friday = [], saturday = [], sunday = []
        
        list.forEach(element => {
            var date = element.date.toISOString()
            console.log(date)
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

        console.log('monday', monday)
        console.log('friday', friday)

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

exports.notImplemented = function(req, res) {
    res.send('<h1>Not yet implemented</h1>')
}