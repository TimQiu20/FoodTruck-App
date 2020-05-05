const express = require('express')
const router = express.Router()
const checkAuthentication = require('../utils/checkAuthentication')
const roleCheck = require('../utils/roleCheck')

router.get('/', checkAuthentication(), function(req, res, next) {
    const db = require('../config/db-config')
    const username = req.user.user_id
    console.log(`Current user is: ${username}.`)
    db.query('SELECT userType FROM login_classifier WHERE username = ?', [username], function(error, results, fields) {
        if (error) {
            throw error
        } else {
            const usertype = results[0].userType
            console.log(`Your user type is: ${usertype}`)
            const userRoles = roleCheck(usertype)
            console.log(userRoles)
            res.render('home', { userRoles: userRoles, classifier: results[0].userType, username: username })
        }
    })
})

module.exports = router