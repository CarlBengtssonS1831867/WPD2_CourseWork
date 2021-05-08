const nedb = require('nedb')

class ExcersisePlan {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new nedb({filename: dbFilePath, autoload: true})
            console.log('Database loaded from:', dbFilePath)
        } else {
            this.db = new nedb()
            console.log('Database loaded in memory')
        }
    }

    insertNewActivity(date, activity, reps, unit) {
        var entry = {
            date: new Date(date),
            activity: activity,
            reps, reps,
            unit: unit
        }

        this.db.insert(entry, function(err, doc) {
            if (err) {
                console.log('Error: ', err)
            } else {
                console.log('Document Inserted: ', doc)
            }
        })
    }

    selectAllEntries() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, entries) {
                if (err) {
                    reject(err)
                } else {
                    resolve(entries)
                }
            })
        })
    }

    selectWeekPlan(weekNumber, userID) {
        return new Promise((resolve, reject) => {
            this.db.findOne({week: weekNumber, userID: userID}, function(err, entry) {
                if (err) {
                    reject(err)
                } else {
                    resolve(entry)
                }
            })
        })
    }

    selectWeekPlanByID(weekID) {
        return new Promise((resolve, reject) => {
            this.db.findOne({_id: weekID}, function(err, entry) {
                if (err || !entry) {
                    reject(err)
                } else {
                    resolve(entry)
                }
            })
        })
    }

    removeEntry(id) {
        this.db.remove({_id: id}, {}, function(err, numRemoved) {
            if (err) {
                console.log('Error: ', err)
            } else {
                console.log('Entires Removed: ', numRemoved)
            }
        })
    }
}


module.exports = ExcersisePlan