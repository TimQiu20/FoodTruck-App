const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const passport = require('passport')

router.get('/', function(req, res, next) {
    res.render('register', { errors: null })
})

function emailNullCheck(email, role) { return !(email == '' && role != '') }
function roleNullCheck(role, email) { return !(role == '' && email != '') }

const validationChecks = [
    check('username', 'Username cannot be empty.').notEmpty(),
    check('fname', 'First name cannot be empty.').notEmpty(),
    check('lname', 'Last name cannot be empty.').notEmpty(),
    check('email', 'The email is invalid.').normalizeEmail().isEmail().optional({ nullable: true, checkFalsy: true }),
    check('password', 'Password must be > 8 characters long.').isLength({ min: 8 }),
    check('cpassword', 'Passwords do not match.')
        .custom((value, { req }) => (value === req.body.password)),
    check('balance', 'Balance has to be a positive numeric value between 0 and 10000.')
        .isFloat({ gt: 0.0, lt: 10000.0 }).optional({ nullable: true, checkFalsy: true }),
    check('email', 'You have to fill out email field to be able to register as an employee.')
        .custom((value, { req }) => emailNullCheck(value, req.body.role)),
    check('role', 'You have to fill out employee role field to be able to register as an employee.')
        .custom((value, { req }) => roleNullCheck(value, req.body.email))
]

// adding user to database after registering
router.post('/', validationChecks, function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('register', { errors: errors.array() })
    } else {
        const iUsername = req.body.username
        const iEmail = req.body.email
        const iFname = req.body.fname
        const iLname = req.body.lname
        const iPassword = req.body.password
        const iBalance = (req.body.balance !== '') ? parseFloat(req.body.balance) : null
        const iRole = (req.body.role !== '') ? req.body.role : null

        // initiate db connection
        const db = require('../config/db-config')
        db.query('CALL register(?, ?, ?, ?, ?, ?, ?)', [iUsername, iEmail, iFname, iLname, iPassword, iBalance, iRole], function(error, results, fields) {
            if (error) {
                res.redirect('/login')
            } else {
                db.query('SELECT LAST_INSERT_ID() AS userId', function(error, results, fields) {
                    if (error) {
                        res.redirect('/login')
                    } else {
                        const userId = results[0]
                        req.login(userId, function(error) {
                            res.redirect('/login')
                        })
                    }
                })
            }
        })
    }
})

passport.serializeUser(function(userId, done) {
    done(null, userId);
})

passport.deserializeUser(function(userId, done) {
    done(null, userId)
})

module.exports = router