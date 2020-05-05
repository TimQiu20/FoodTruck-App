const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    res.render('createFood')
})

router.post('/', function(req, res, next) {
    const db = require('../config/db-config')
    const foodname = req.body.foodname

    db.query('CALL ad_create_food(?)', [foodname], function(error, results, fields) {
        if (error) {
            res.redirect('/manageFood')
        } else {
            res.redirect('/manageFood')
        }
    })
})

module.exports = router