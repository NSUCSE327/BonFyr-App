if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Bon-Fyr App',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

mongoose.connect('mongodb://localhost:27017/bon-fyr', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const sessionConfig = {
    secret:'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)





/**
 * Route serving camp home page.
 * @name get/
 * @function
 * @inner
 * @param {express.path} path - Express path
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

module.exports = app; // for testing