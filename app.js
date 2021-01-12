/**
 * express module
 * @const
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const campgrounds = require('./routes/campgrounds.js')

mongoose.connect('mongodb://localhost:27017/bon-fyr', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/**
 * Function handling server side errors.
 * @name validateCampground
 * @function 
 * @inner
 * @param {callback} middleware - Express middleware.
 */


app.use("/campgrounds", campgrounds);

/**
 * Route serving camp home page.
 * @name get/
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/', (req, res) => {
    res.render('home')
});



/**
 * Route handling error urls.
 * @name all/*
 * @function 
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

/**
 * Function handling unknown errors.
 * @name use/err
 * @function 
 * @inner
 * @param {callback} middleware - Express middleware.
 */
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

/**
 * Function to serve on desired port
 * @name listen
 * @function 
 * @inner
 * @param {Number} port - Port number
 * @param {callback} middleware - Express middleware.
 */
app.listen(3000, () => {
    console.log('Serving on port 3000')
})