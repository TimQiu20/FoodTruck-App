const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
        const stations = results
        db.query('SELECT foodName FROM Food', [], function(error, results, fields) {
            const foods = results
            const sql = 'SELECT CONCAT(firstName , " " , lastName) as fullname, STAFF.username ' +
                        'FROM Staff ' +
                        'INNER JOIN USER ' +
                        'ON STAFF.username = USER.username ' +
                        'WHERE Staff.foodTruckName IS NULL;'
            db.query(sql, [], function(error, results, fields) {
                const availableStaff = results
                res.render('createFoodTruck', { stations: stations, foods: foods, availableStaff: availableStaff })
            })
        })
    })
})

router.post('/', checkAuthentication(), async function(req, res, next) {
    const currentUser = req.user.user_id
    const foodTruckName = req.body.foodTruckName
    const stationName = req.body.stationName
    const staffNames = req.body.assignedStaff
    const foodNames = req.body.foodName
    const foodPrices = req.body.price

    if (staffNames == undefined || stationName == undefined) {
        console.log("reach herer")
        res.redirect('/manageFoodTruck')
    } else{
    const db = require('../config/db-config')
    db.query('CALL mn_create_foodTruck_add_station(?, ?, ?)', [foodTruckName, stationName, currentUser], function(error, results, fields) {})
    if (typeof(staffNames) != 'string') {
        for (let i = 0; i < staffNames.length; i++) {
             db.query('CALL mn_create_foodTruck_add_staff(?, ?)', [foodTruckName, staffNames[i]], function(error, results, fields) {})
        }
    }
    else {
         db.query('CALL mn_create_foodTruck_add_staff(?, ?)', [foodTruckName, staffNames], function(error, results, fields) {})
    }
    if (typeof(foodNames) != 'string') {
        for (let i = 0; i < foodNames.length; i++) {
            db.query('CALL mn_create_foodTruck_add_menu_item(?, ?, ?)', [foodTruckName, parseFloat(foodPrices[i]), foodNames[i]], function(error, results, fields) {})
        }
    } else {
         db.query('CALL mn_create_foodTruck_add_menu_item(?, ?, ?)', [foodTruckName, parseFloat(foodPrices), foodNames], function(error, results, fields) {})
    }
    res.redirect('/manageFoodTruck')

    }
})


module.exports = router