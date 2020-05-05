const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', function(req, res, next) {
    const errors = req.flash().error || []
    res.render('login', { errors })
})

const auth = passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true,
})
router.post('/', auth, function(req, res, next) {

})

module.exports = router