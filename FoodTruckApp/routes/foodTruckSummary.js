const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')
const roleCheck = require('../utils/roleCheck')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const currentUser = req.user.user_id
    console.log(`Current User is: ${currentUser}.`)

    db.query('SELECT userType FROM login_classifier WHERE username = ?', [currentUser], function(error, results, fields) {
        if (error) throw error
        const userRoles = roleCheck(results[0].userType)
        if (!userRoles.manager) {
            res.redirect('/home')
        } else {
            db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
                // if (error) throw error
                const stations = results
                db.query('CALL mn_filter_summary(?, ?, ?, ?, ?, ?, ?)', [currentUser, null, null, null, null, null, null], function(error, results, fields) {
                    // if (error) throw error
                    db.query('SELECT * FROM mn_filter_summary_result', [], function(error, results, fields) {
                        // if (error) throw error
                        const summary = results
                        res.render('foodTruckSummary', { stationNames: stations, summary: summary })
                    })
                })
            })
        }
    })
})

router.post('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const manager = req.user.user_id
    if (req.body.submitBtn == 'filter') {
        const ftname = req.body.foodTruckName
        const stnname = req.body.stationName
        const dateFrom = req.body.dateFrom ? req.body.dateFrom : null
        const dateTo = req.body.dateTo ? req.body.dateTo : null
        const sortby = req.body.sortby ? req.body.sortby : null
        const order = req.body.order ? req.body.order : null
        db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
            // if (error) throw error
            const stations = results
            db.query('CALL mn_filter_summary(?, ?, ?, ?, ?, ?, ?)', [manager, ftname, stnname, dateFrom, dateTo, sortby, order], function(error, results, fields) {
                // if (error) throw error
                db.query('SELECT * FROM mn_filter_summary_result', [], function(error, results, fields) {
                    // if (error) throw error
                    const summary = results
                    res.render('foodTruckSummary', { stationNames: stations, summary: summary })
                })
            })
        })
    } else if (req.body.submitBtn == 'detail') {
        const foodTruckName = req.body.foodTruckRadioBtn
        db.query('CALL mn_summary_detail(?, ?)', [manager, foodTruckName], function(error, results, fields) {
            // if (error) throw error
            db.query('SELECT * FROM mn_summary_detail_result', [], function(error, results, fields) {
                // if (error) throw error
                const details = results
                res.render('summaryDetail', { foodTruckName: foodTruckName, details: details })
            })
        })

    }
})

module.exports = router