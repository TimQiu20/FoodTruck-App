const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    res.render('updateBuilding')
})

router.post('/', checkAuthentication(), function(req, res, next) {
    const buildingName = req.body.buildingName
    const oldBuildingName = req.body.oldBuildingName
    const description = req.body.description
    const tags = req.body.tagName

    const db = require('../config/db-config')

    db.query('CALL ad_update_building(?, ?, ?)', [oldBuildingName, buildingName, description],function(error, results, fields) {
        if (error) {
            // res.redirect('/manageBuildingAndStation')
        } else {
            if (tags) {
                if (typeof(tags) != 'string') {
                    for (let i = 0; i < tags.length; i++) {
                        db.query('CALL ad_add_building_tag(?, ?)', [buildingName, tags[i]], function(error, results, fields) {
                            if (error) {
                                console.log("error")    
                            }
                        })
                    }
                } else if (tags != '') {
                    db.query('CALL ad_add_building_tag(?, ?)', [buildingName, tags], function(error, results, fields) {
                        if (error) {
                            // res.redirect('/manageBuildingAndStation')
                        } else {
                            // res.redirect('/manageBuildingAndStation')
                        }
                    })
                }
            }
        }
        res.redirect('/manageBuildingAndStation')

    })
})

module.exports = router