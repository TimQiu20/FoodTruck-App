const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    res.render('updateFoodTruck')
})

router.post('/', checkAuthentication(), async function(req, res, next) {
    const foodTruckName = req.body.foodTruckName
    const stationName = req.body.stationName
    const staffNames = req.body.assignedStaff
    const foodNames = req.body.foodName
    const foodPrices = req.body.price

    const db = require('../config/db-config')
    await db.query('CALL mn_update_foodTruck_station(?, ?)', [foodTruckName, stationName], function(error, results, fields) {})
    if (staffNames) {
        if (typeof(staffNames) != 'string') {
            for (let i = 0; i < staffNames.length; i++) {
                await db.query('CALL mn_update_foodTruck_staff(?, ?)', [foodTruckName, staffNames[i]], function(error, results, fields) {})
            }
        } else if (staffNames != '') {
            await db.query('CALL mn_update_foodTruck_staff(?, ?)', [foodTruckName, staffNames], function(error, results, fields) {})
        }
    }
    if (foodNames) {
        if (typeof(foodNames) != 'string') {
            for (let i = 0; i < foodNames.length; i++) {
                await db.query('CALL mn_update_foodTruck_menu_item(?, ?, ?)', [foodTruckName, parseFloat(foodPrices[i]), foodNames[i]], function(error, results, fields) {})
            }
        } else if (foodNames != '') {
            await db.query('CALL mn_update_foodTruck_menu_item(?, ?, ?)', [foodTruckName, parseFloat(foodPrices), foodNames], function(error, results, fields) {})
        }
    }

    res.redirect('/manageFoodTruck')
})

module.exports = router