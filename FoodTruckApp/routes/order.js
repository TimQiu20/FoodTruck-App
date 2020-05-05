const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')

router.get('/', checkAuthentication(), function(req, res, next) {
    console.log('GET order')
})

router.post('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const currUser = req.user.user_id
    const foodTruckName = req.body.foodTruckName
    const checkedFood = req.body.foodChecked
    const purchaseQuantity = req.body.pq
    const foodPrices = req.body.foodPrice
    const actualQuantities = []
    const actualPrices = []

    const foodQuantityMatch = []
    if (typeof(checkedFood) != 'string') {
        for (let i = 0; i < purchaseQuantity.length; i++) {
            if (purchaseQuantity[i] != '0')
                actualQuantities.push(purchaseQuantity[i])
            actualPrices.push(foodPrices[i])
        }
        for (let i = 0; i < checkedFood.length; i++) {
            foodQuantityMatch.push({
                name: checkedFood[i],
                quantity: parseInt(actualQuantities[i]),
                price: parseFloat(actualPrices[i])
            })
        }
    } else {
        let actualQuantity = ''
        let actualPrice = ''
        for (let i = 0; i < purchaseQuantity.length; i++) {
            if (purchaseQuantity[i] != '0') {
                actualQuantity = purchaseQuantity[i]
                actualPrice = foodPrices[i]
            }
        }
        foodQuantityMatch.push({
            name: checkedFood,
            quantity: parseInt(actualQuantity),
            price: parseFloat(actualPrice)
        })
    }
    console.log(foodQuantityMatch)

    db.query('SELECT balance FROM Customer WHERE username = ?', [currUser], function(error, results, fields) {
        const userBalance = results[0].balance
        let priceTotal = 0
        foodQuantityMatch.forEach(function(food) {
            priceTotal = priceTotal + food.price * food.quantity
        })
        priceTotal = priceTotal.toFixed(2)
        if (priceTotal > userBalance) {
            console.log('You do not have enough balance for the purchase!')
            res.redirect('currentInformation')
        } else {
            const date = req.body.date
            const remainBalance = userBalance - priceTotal
            db.query('CALL cus_order(?, ?)', [date, currUser], function (error, results, fields) {
                db.query('SELECT orderID FROM Orders WHERE customerUsername = ? AND date = ?', [currUser, date], function(error, results, fields) {
                    const orderId = results[0].orderID
                    const sql = 'INSERT INTO OrderDetail VALUES (?, ?, ?, ?);'
                    for (let i = 0; i < foodQuantityMatch.length; i++) {
                        db.query(sql, [orderId, foodTruckName, foodQuantityMatch[i].name, foodQuantityMatch[i].quantity], function(error, results, fields) {
                            if (error) throw error
                        })
                    }
                    db.query('UPDATE Customer SET balance = ? WHERE ? = Customer.username', [remainBalance, currUser], function(error, results, fields) {
                    })
                })
                res.redirect('orderHistory')
            })
        }
    })
})

module.exports = router