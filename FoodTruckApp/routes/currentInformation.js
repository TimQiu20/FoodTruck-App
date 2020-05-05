const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
	const db = require('../config/db-config')
    const currUser = req.user.user_id
    db.query('call cus_current_information_basic(?)', [currUser], function(error, results, fields) {
    	// if (error) throw error
    	db.query('select * from cus_current_information_basic_result', [], function(error,results,fields) {
    		// if (error) throw error
    		const basic = results
    		db.query('call cus_current_information_foodTruck(?)', [currUser], function(error, results, fields) {
    			// if (error) throw error
    			db.query('select * from cus_current_information_foodTruck_result', [], function(error,results,fields) {
    				// if (error) throw error
    			    res.render('currentInformation', {basic: basic, order:results})
    			})
   			})
    	})
    })

})
router.post('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const ftname = req.body.orderRadio
    if (req.body.submitBtn == 'order') {
        db.query('SELECT * FROM menuitem WHERE foodTruckName = ?', [ftname], function(error, results, fields) {
            res.render('order',{ftName:ftname,item:results})
        })
    }
})
module.exports = router