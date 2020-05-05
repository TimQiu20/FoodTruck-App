const express = require('express')
const app = express()

const logger = require('morgan')
const cookieParser = require('cookie-parser')

require('dotenv').config()
// auth setup
const md5 = require('md5')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const MySQLStore = require('express-mysql-session')
const options = {
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_PASSWORD,
    database    : process.env.DB_NAME
}
const sessionStore = new MySQLStore(options)
app.use(session({
    secret: 'pIwWtJHp0Trb',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

const flash = require('connect-flash')
app.use(flash())

const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const homeRouter = require('./routes/home')
const createBuildingRouter = require('./routes/createBuilding')
const createFoodRouter = require('./routes/createFood')
const createFoodTruckRouter = require('./routes/createFoodTruck')
const createStationRouter = require('./routes/createStation')
const currentInformationRouter = require('./routes/currentInformation')
const exploreRouter = require('./routes/explore')
const foodTruckSummaryRouter = require('./routes/foodTruckSummary')
const manageBuildingAndStationRouter = require('./routes/manageBuildingAndStation')
const manageFoodRouter = require('./routes/manageFood')
const manageFoodTruckRouter = require('./routes/manageFoodTruck')
const orderRouter = require('./routes/order')
const orderHistoryRouter = require('./routes/orderHistory')
const summaryDetailRouter = require('./routes/summaryDetail')
const updateBuildingRouter = require('./routes/updateBuilding')
const updateFoodTruckRouter = require('./routes/updateFoodTruck')
const updateStationRouter = require('./routes/updateStation')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})

app.use(express.static(__dirname + '/public'))

app.use('/', indexRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/home', homeRouter)
app.use('/createBuilding', createBuildingRouter)
app.use('/createFood', createFoodRouter)
app.use('/createFoodTruck', createFoodTruckRouter)
app.use('/createStation', createStationRouter)
app.use('/currentInformation', currentInformationRouter)
app.use('/explore', exploreRouter)
app.use('/foodTruckSummary', foodTruckSummaryRouter)
app.use('/manageBuildingAndStation', manageBuildingAndStationRouter)
app.use('/manageFood', manageFoodRouter)
app.use('/manageFoodTruck', manageFoodTruckRouter)
app.use('/order', orderRouter)
app.use('/orderHistory', orderHistoryRouter)
app.use('/summaryDetail', summaryDetailRouter)
app.use('/updateBuilding', updateBuildingRouter)
app.use('/updateFoodTruck', updateFoodTruckRouter)
app.use('/updateStation', updateStationRouter)


passport.use(new LocalStrategy({
    passReqToCallback: true,
},
    function(req, username, password, done) {
        const db = require('./config/db-config')
        db.query('SELECT username, password FROM User WHERE username = ?', [username], function(error, results, fields) {
            if (error) { done(error) }
            if (!results || results.length === 0) {
                return done(null, false, req.flash('error', 'User not found'))
            }
            const hashedPass = results[0].password.toString()
            if (md5(password) === hashedPass) {
                return done(null, { user_id: results[0].username })
            } else {
                return done(null, false, req.flash('error', 'Password incorrect.'))
            }
        })
    }
))

const port = 3000
app.listen(port, () => console.log(`Listening at http://localhost:${port}`))