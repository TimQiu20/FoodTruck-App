const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    res.render('createBuilding')
})

router.post('/', checkAuthentication(), async function(req, res, next) {
    const buildingName = req.body.buildingName
    const description  = req.body.description
    const tags = req.body.tagName

    const db = require('../config/db-config')
    await db.query('CALL ad_create_building(?, ?)', [buildingName, description])
    console.log(tags)

    if (tags) {
        if (typeof(tags) == 'string') { // single
            await db.query('CALL ad_add_building_tag(?, ?)', [buildingName, tags], function(error, results, fields) {})
        } else {
            for (let i = 0; i < tags.length; i++) {
                await db.query('CALL ad_add_building_tag(?, ?)', [buildingName, tags[i]], function(error, results, fields) {})
            }
        }
    }
    res.redirect('/manageBuildingAndStation')
})

module.exports = router