const passport = require('passport')
const { Strategy } = require('passport-local')
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')

exports.init = function(app) {
    passport.use(new Strategy((username, password, callback) => {
        userModel.findUser(username, (err, user) => {
            if (err) {
                console.log('Error finding user: ', err)
                return callback(err)
            } else if (!user) {
                console.log(`Username: '${username}' was not found `)
                return callback(null, false)
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    callback(null, user)
                } else {
                    callback(null, false)
                }
            })
        })
    }))

    passport.serializeUser((user, callback) => {
        callback(null, user.username)
    })

    passport.deserializeUser((id, callback) => {
        userModel.findUser(id, (err, user) => {
            if (err) {
                return callback(err)
            }
            callback(null, user)
        })
    })

    app.use(passport.initialize())
    app.use(passport.session())

}

exports.authorize = function(redirect) {
    return passport.authenticate('local', {successReturnToOrRedirect: '/Dashboard', failureRedirect: redirect, failureFlash: 'Username or Password was not found, please try again.'})
}