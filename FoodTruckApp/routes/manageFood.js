const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')

    db.query('SELECT * FROM Food', [], function(error, results, fields) {
        // if (error) throw error
        const allFoodNames = results
        const sql =  'SELECT * FROM (SELECT MenuCounts.foodName, MenuCounts.menuCount, COALESCE(SUM(OrderDetail.purchaseQuantity), 0) AS purchaseCount ' +
                     'FROM (SELECT Food.foodName, count(MenuItem.foodTruckName) AS menuCount ' +
                     'FROM Food LEFT JOIN MenuItem ON Food.foodName = MenuItem.foodName GROUP BY foodName) AS MenuCounts '+
                     'LEFT JOIN OrderDetail ON MenuCounts.foodName = OrderDetail.foodName GROUP BY MenuCounts.foodName) as innerTable'
        db.query(sql, [], function(error, results, fields) {
            // if (error) throw error
            const foods = results
            res.render('manageFood', { allFoodNames: allFoodNames, foods: foods, errors: null})
        })
    })
})

const validationChecks = [
    check('foodname', 'You must provide sort method and order to filter.')
        .custom((value, { req }) => (req.body.sortby != '' && req.body.order != ''))
]

router.post('/', validationChecks, function(req, res, next) {
    const db = require('../config/db-config')
    if (req.body.submitBtn == 'delete') {
        db.query('CALL ad_delete_food(?)', [req.body.foodRadioBtn], function(error, results, fields) {
            if (error) {
                res.redirect('/manageFood')
            } else {
                res.redirect('/manageFood')
            }
        })
    } else {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const db = require('../config/db-config')
            db.query('SELECT * FROM Food', [], function(error, results, fields) {
                // if (error) throw error
                const allFoodNames = results
                const sql =  'SELECT * FROM (SELECT MenuCounts.foodName, MenuCounts.menuCount, COALESCE(SUM(OrderDetail.purchaseQuantity), 0) AS purchaseCount ' +
                    'FROM (SELECT Food.foodName, count(MenuItem.foodTruckName) AS menuCount ' +
                    'FROM Food LEFT JOIN MenuItem ON Food.foodName = MenuItem.foodName GROUP BY foodName) AS MenuCounts '+
                    'LEFT JOIN OrderDetail ON MenuCounts.foodName = OrderDetail.foodName GROUP BY MenuCounts.foodName) as innerTable'
                db.query(sql, [], function(error, results, fields) {
                    // if (error) throw error
                    const foods = results
                    res.render('manageFood', { allFoodNames: allFoodNames, foods: foods, errors: errors.array()})
                })
            })
        } else {
            db.query('CALL ad_filter_food(?, ?, ?)',
                [req.body.foodname, req.body.sortby, req.body.order],
                function(error, results, fields) {
                    // if (error) throw error
                    db.query('SELECT * FROM ad_filter_food_result', [], function(error, results, fields) {
                        // if (error) throw error
                        const foods = results
                        db.query('SELECT * FROM Food', [], function(error, results, fields) {
                            const allFoodNames = results
                            res.render('manageFood', { foods: foods, errors: null, allFoodNames: allFoodNames })
                        })
                    })
                })
        }
    }
})



module.exports = router