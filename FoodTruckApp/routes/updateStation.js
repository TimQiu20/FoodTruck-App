const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', function(req, res, next) {

})

router.post('/', checkAuthentication(), function(req, res, next) {
    const stationName = req.body.stationName
    const capacity  = req.body.stationCapacity == '' ? 10 : parseInt(req.body.stationCapacity)
    const buildingName = req.body.sponsoredBuilding

    console.log(stationName)
    console.log(capacity)
    console.log(buildingName)

    const db = require('../config/db-config')

    db.query('CALL ad_update_station(?, ?, ?)', [stationName, capacity, buildingName], function(error, results, fields) {
        // if (error) throw error
        res.redirect('/manageBuildingAndStation')
    })
})

module.exports = router
