exports.login = function(req, res) {
    res.render('login', {
        'title': 'Login'
    })
}

exports.dashboard = function(req, res) {
    res.send('<h1>Not yet implemented</h1>')
}

exports.notImplemented = function(req, res) {
    res.send('<h1>Not yet implemented</h1>')
}