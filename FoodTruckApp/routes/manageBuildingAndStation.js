const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')
const roleCheck = require('../utils/roleCheck')

function retrieveData(db, req, res) {

    const sql = 'SELECT Building.buildingName, Station.stationName FROM Building INNER JOIN Station ON Building.buildingName = Station.buildingName;'
    db.query(sql, [], function(error, results, fields) {
        // if (error) throw error
        const bldgStnPairs = results

        const currBN = req.body.buildingName
        const currTag  = req.body.buildingTag
        const currStn = req.body.stationName
        const minCap = req.body.capacityLower ? parseInt(req.body.capacityLower) : 0
        const maxCap = req.body.capacityUpper ? parseInt(req.body.capacityUpper) : 100
        const allBuildingNames = []
        const allStationNames = []
        bldgStnPairs.forEach(function(bsp) {
            allBuildingNames.push(bsp.buildingName)
            allStationNames.push(bsp.stationName)
        })
        db.query('CALL ad_filter_building_station(?, ?, ?, ?, ?)', [currBN, currTag, currStn, minCap, maxCap], function(error, results, fields) {
            // if (error) throw error
            db.query('SELECT * FROM ad_filter_building_station_result', [], function(error, results, fields) {
                res.render('manageBuildingAndStation', { bnames: allBuildingNames, snames: allStationNames, bldgInfo: results })
            })
        })
    })
}

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const currUser = req.user.user_id

    db.query('SELECT userType FROM login_classifier WHERE username = ?', [currUser], function(error, results, fields) {
        // if (error) throw error
        const userRoles = roleCheck(results[0].userType)
        if (!userRoles.admin) {
            res.redirect('/home')
        }
        retrieveData(db, req, res)
    })
})

router.post('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const submitBtn = req.body.submitBtn
    if (submitBtn == 'filter') {
        retrieveData(db, req, res)
    } else if (submitBtn == 'deleteBuilding') {
        const bldg = req.body.buildingRadioBtn
        if (bldg) {
            db.query('CALL ad_delete_building(?)', [bldg], function(error, results, fields) {
                // if (error) throw error
                res.redirect('/manageBuildingAndStation')
            })
        } else {
            res.redirect('/manageBuildingAndStation')
        }
    } else if (submitBtn == 'deleteStation') {
        const stn = req.body.stationRadioBtn
        if (stn) {
            db.query('CALL ad_delete_station(?)', [stn], function(error, results, fields) {
                if (error) {
                    res.redirect('/manageBuildingAndStation')
                } else {
                    res.redirect('/manageBuildingAndStation')
                }
            })
        } else {
            res.redirect('/manageBuildingAndStation')
        }
    } else if (submitBtn == 'updateBuilding') {
        db.query('CALL ad_view_building_general(?)', [req.body.buildingRadioBtn], function(error, results, fields) {
            // if (error) throw error
            db.query('SELECT * FROM ad_view_building_general_result', [], function(error, results, fields) {
                // if (error) throw error
                const bldg = results[0]
                console.log('manageBuilding')
                console.log(bldg)
                db.query('CALL ad_view_building_tags(?)', [req.body.buildingRadioBtn], function(error, results, fields) {
                    // if (error) throw error
                    db.query('SELECT * FROM ad_view_building_tags_result', [], function(error, results, fields) {
                        // if (error) throw error
                        res.render('updateBuilding', { oldBuildingName: req.body.buildingRadioBtn, oldDescription: bldg.description, oldTags: results })
                    })
                })
            })
        })
    } else if (submitBtn == 'updateStation') {
        const oldStationName = req.body.stationRadioBtn
        db.query('SELECT capacity, buildingName FROM Station WHERE stationName = ?', [oldStationName], function(error, results, fields) {
            // if (error) throw error
            const oldCapacity = results[0].capacity
            const oldBuilding = results[0].buildingName
            db.query('CALL ad_get_available_building()',[], function(error, results, fields) {
                // if (error) throw error
                db.query('CALL ad_get_available_building()', [], function(error, results, fields) {
                    // if (error) throw error
                    db.query('SELECT * FROM ad_get_available_building_result', [], function(error, results, fields) {
                        // if (error) throw error
                        const buildings = results
                        res.render('updateStation', { oldStationName: oldStationName, oldCapacity: oldCapacity, oldBuilding: oldBuilding, buildingNames: buildings })
                    })
                })
            })
        })
    }
})

module.exports = router