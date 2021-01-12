/**
 * express module
 * @const
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

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
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



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
 * Route serving campgrounds index page.
 * @name get/campgrounds
 * @async
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

/**
 * Route serving new campgrounds form.
 * @name get/campgrounds/new
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

/**
 * Post Route serving camp creation.
 * @name post/campgrounds
 * @function
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

/**
 * Route serving camp show page.
 * @name get/campgrounds/:id
 * @function
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));

/**
 * Route serving camp edit form.
 * @name get/campgrounds/:id/edit
 * @function 
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))

/**
 * Route serving camp update.
 * @name put/campgrounds/:id
 * @function 
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}));

/**
 * Route serving camp deletion.
 * @name delete/campgrounds/:id
 * @function 
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

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