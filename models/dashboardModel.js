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

    newWeekPlan(userID, week) {
        var entry = {
            userID: userID,
            week: week,
            tasks: []
        }
        return new Promise((resolve, reject) => {
            this.db.insert(entry, function(err, doc) {
                if (err) {
                    console.log('Error: ', err)
                    reject(err)
                } else {
                    console.log('Document Inserted: ', doc)
                    resolve(doc)
                }
            })
        })
    }

    insertNewActivity(week, userID, day, activity, reps, unit, weekday, id) {
        var entry = {
            day: day,
            activity: activity,
            reps: parseInt(reps),
            unit: unit,
            completed: 0,
            weekday: weekday,
            id: parseInt(id),
            show: 1
        }
        
        this.db.update({week: parseInt(week), userID: userID}, {$push: {tasks: entry}},  {}, function(err, doc) {
            if (err) {
                console.log('Error: ', err)
            } else {
                console.log('Updated docs: ', doc)
            }
        })
    }

    selectAllEntries(id) {
        return new Promise((resolve, reject) => {
            this.db.find({userID: id}, function(err, entries) {
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
                if (err || !entry) {
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

    removeEntry(week, userID, taskID) {
        return new Promise((resolve, reject) => {
            this.db.findOne({week: week, userID: userID}, (err, doc) => {
                if (err) {
                    reject()
                } else {
                    resolve(doc)
                }
            })
        }).then(doc => {
            var entry = doc
            doc.tasks.forEach((element, index) => {
                if (element.id == taskID) {
                    entry.tasks[index].show = 0
                }
            })
            this.db.update({week: week, userID: userID}, entry, {}, (err, numRep) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(numRep)
                }
            })
        })
    }

    editEntry(week, userID, taskID, activity, number, unit) {
        return new Promise((resolve, reject) => {
            this.db.findOne({week: week, userID: userID}, (err, doc) => {
                if (err) {
                    reject()
                } else {
                    resolve(doc)
                }
            })
        }).then(doc => {
            var entry = doc
            entry.tasks.forEach((element, index) => {
                if (element.id == taskID) {
                    entry.tasks[index].activity = activity
                    entry.tasks[index].reps = number
                    entry.tasks[index].unit = unit
                }
            })
            this.db.update({week: week, userID: userID}, entry, {}, (err, numRep) => {
                if (err) {
                    console.log(err)
                }
            })
        })
    }

    completeEntry(week, userID, taskID) {
        return new Promise((resolve, reject) => {
            this.db.findOne({week: week, userID: userID}, (err, doc) => {
                if (err) {
                    reject()
                } else {
                    resolve(doc)
                }
            })
        }).then(doc => {
            doc.tasks.forEach(element => {
                if (element.id == taskID) {
                    if (element.completed == 0) {
                        element.completed = 1
                    } else {
                        element.completed = 0
                    }
                }
            })
            this.db.update({week: week, userID: userID}, doc, {}, (err, numRep) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(numRep)
                }
            })
        })
    }
}


module.exports = ExcersisePlan