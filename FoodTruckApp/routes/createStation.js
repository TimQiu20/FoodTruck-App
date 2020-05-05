const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    db.query('CALL ad_get_available_building()',[], function(error, results, fields) {
        // if (error) throw error
        db.query('SELECT * FROM ad_get_available_building_result', [], function(error, results, fields) {
            // if (error) throw error
            const buildings = results
            res.render('createStation', {buildingNames: buildings})
        })
    })
})

router.post('/', checkAuthentication(), function(req, res, next) {
    const stationName = req.body.stationName
    const capacity  = req.body.stationCapacity == '' ? 10 : parseInt(req.body.stationCapacity)
    const buildingName = req.body.sponsoredBuilding
    const db = require('../config/db-config')
    const sql = 'INSERT INTO Station (stationName, buildingName, capacity) ' +
        'VALUES (?, ?, ?)'
    db.query(sql, [stationName, buildingName, capacity], function(error, results, fields) {
        if (error) {
            res.redirect('/manageBuildingAndStation')
        } else {
            res.redirect('/manageBuildingAndStation')
        }
    })
})

module.exports = router
