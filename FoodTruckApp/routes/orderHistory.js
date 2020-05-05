const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const currentUser = req.user.user_id
    console.log(`Current user is: ${currentUser}.`)
    db.query('call cus_order_history(?)',[currentUser], function(error, results, fields) {
    	// if (error) throw error
    		db.query('Select * From cus_order_history_result',[],  function(error, results, fields) {
    			console.log(results)
    			res.render('orderHistory', {orders: results, errors:null})
    		})
    })
})

module.exports = router