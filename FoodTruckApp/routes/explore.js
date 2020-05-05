const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
	const db = require('../config/db-config')
    retrieveData(db,req,res)
})

router.post('/', checkAuthentication(), function(req, res, next) {
	const db = require('../config/db-config')
    const submitBtn = req.body.submitBtn
    const currUser = req.user.user_id
    console.log(req.body.stationRadio)
    if (submitBtn == 'filter') {
        retrieveData(db, req, res)
    } else if (submitBtn == 'Selete As Current Location') {
    	const target = req.body.stationRadio
    	console.log(target)
    	if (target) {
    		db.query('call cus_select_location(?,?)',[currUser,target] , function(error, results, fields) {
            })
    	}
        res.redirect('/home')
    }
})

function retrieveData(db, req, res) {
    db.query('SELECT buildingName FROM Building', [], function(error, results, fields) {
    	const allBuildingNames = results
    	db.query('SELECT stationName FROM Station', [], function(error, results, fields) {
    			const allStationNames = results
    		    const currBN = req.body.buildingName
    			const currTag  = req.body.buildingTag
         		const currStn = req.body.stationName
        		const currFT = req.body.foodTruckName
     		    const currF = req.body.foodName
     		    console.log(currFT)
     		    db.query('call cus_filter_explore(?,?,?,?,?)',[currBN, currStn, currTag, currFT, currF], function(error, results, fields) {
     		    	db.query('SELECT * FROM cus_filter_explore_result', [], function(error, results, fields) {
     		    		res.render('explore',{bnames:allBuildingNames,snames:allStationNames,info:results})
                	})
     		    })
    	})
    })

}
module.exports = router