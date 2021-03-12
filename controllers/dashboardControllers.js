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
    res.redirect('/Plan')
}

exports.plan = function(req, res) {
    res.sendFile(public + '/plan.html')
}

exports.notImplemented = function(req, res) {
    res.send('<h1>Not yet implemented</h1>')
}