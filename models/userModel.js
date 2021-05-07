const nedb = require('nedb')
const bcrypt = require('bcrypt')
const saltRounds = 10

class Users {
    constructor() {
        this.db = new nedb( { filename: 'users.db', autoload: true})
        console.log('User DB from file: users.db')
    }

    newUser(username, password) {
        bcrypt.hash(password, saltRounds).then(hash => {
            var entry = {
                username: username,
                password: hash
            }
            this.db.insert(entry, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('User has been registered')
                }
            })
        })
    }

    findUser(username, callback) {
        this.db.findOne({username: username}, (err, doc) => {
            if (err) {
                return callback(null, null)
            } else {
                if (!doc) {
                    return callback(null, null)
                }
                return callback(null, doc)
            }
        })
    }
}

module.exports = new Users