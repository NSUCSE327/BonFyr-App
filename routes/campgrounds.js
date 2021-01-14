const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');
/**
 * Route serving campgrounds index page.
 * @name get/campgrounds
 * @async
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

/**
 * Route serving new campgrounds form.
 * @name get/campgrounds/new
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

/**
 * Post Route serving camp creation.
 * @name post/campgrounds
 * @function
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */


/**
 * Route serving camp show page.
 * @name get/campgrounds/:id
 * @function
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

/**
 * Route serving camp edit form.
 * @name get/campgrounds/:id/edit
 * @function 
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
/**
 * Route serving camp update.
 * @name put/campgrounds/:id
 * @function 
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */


/**
 * Route serving camp deletion.
 * @name delete/campgrounds/:id
 * @function 
 * @async
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */


module.exports = router;