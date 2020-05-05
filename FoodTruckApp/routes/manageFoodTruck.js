const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')
const roleCheck = require('../utils/roleCheck')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const currentUser = req.user.user_id
    console.log(`Current user is: ${currentUser}.`)

    db.query('SELECT userType FROM login_classifier WHERE username = ?', [currentUser], function(error, results, fields) {
        // if (error) throw error
        const userRoles = roleCheck(results[0].userType)
        if (!userRoles.manager) {
            res.redirect('/home')
        }
        db.query('CALL mn_filter_foodTruck(?, ?, ?, ?, ?, ?)', [currentUser, '', '', null, null, false], function(error, results, fields) {
            // if (error) throw error
            db.query('SELECT * FROM mn_filter_foodTruck_result', [], function(error, results, fields) {
                // if (error) throw error
                const trucks = results
                db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
                    // if (error) throw error
                    const stations = results
                    res.render('manageFoodTruck', { trucks: trucks, stations: stations })
                })
            })
        })
    })
})

router.post('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    if (req.body.submitBtn == 'delete') {
        db.query('CALL mn_delete_foodTruck(?)', [req.body.truckRadioBtn], function(error, results, fields) {
            // if (error) throw error
            res.redirect('/manageFoodTruck')
        })
    } else if (req.body.submitBtn == 'filter') {
        const manager = req.user.user_id
        const ftname = req.body.foodTruckName
        const sname = req.body.stationName
        const minstaff = req.body.staffCountLower ? parseInt(req.body.staffCountLower) : 0
        const maxstaff = req.body.staffCountUpper ? parseInt(req.body.staffCountUpper) : 100
        const hasremain = req.body.hasRemainingCapacity ? true : false

        db.query('CALL mn_filter_foodTruck(?, ? ,? ,? ,? ,?)',
            [manager, ftname, sname, minstaff, maxstaff, hasremain],
            function(error, results, fields) {
                // if (error) throw error
                db.query('SELECT * FROM mn_filter_foodTruck_result', [], function(error, results, fields) {
                    // if (error) throw error
                    const trucks = results
                    db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
                        // if (error) throw error
                        const stations = results
                        res.render('manageFoodTruck', { trucks: trucks, stations: stations})
                    })
                })
            })
    } else if (req.body.submitBtn == 'update') {
        const ftname = req.body.truckRadioBtn
        db.query('SELECT stationName FROM FoodTruck WHERE foodTruckName = ?', [ftname], function(error, results, fields) {
            // if (error) throw error
            const sname = results[0].stationName
            db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
                // if (error) throw error
                const stations = results
                db.query('SELECT foodName FROM Food', [], function(error, results, fields) {
                    // if (error) throw error
                    const foods = results
                    const sql = 'SELECT CONCAT(firstName , " " , lastName) as fullname, STAFF.username ' +
                        'FROM Staff ' +
                        'INNER JOIN USER ' +
                        'ON STAFF.username = USER.username ' +
                        'WHERE Staff.foodTruckName IS NULL;'
                    db.query(sql, [], function(error, results, fields) {
                        // if (error) throw error
                        const availableStaff = results
                        res.render('updateFoodTruck', { stationName: sname, stations: stations, foods: foods, availableStaff: availableStaff, foodTruckName: ftname })
                    })
                })
            })
        })
    }
})

module.exports = router