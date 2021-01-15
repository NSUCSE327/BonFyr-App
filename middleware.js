/**
 * Module for all middleware functions
 * @module middleware
 */
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

/**
 * Middleware Function to check if a user is logged in.
 * @name isLoggedIn
 * @function
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 * @param {Express.next} next - Express next function.
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
/**
 * Middleware Function to check if campground information are valid.
 * @name validateCampground
 * @function
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 * @param {Express.next} next - Express next function.
 */
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
/**
 * Middleware Function to check if a user is the author of a particular campground.
 * @name isAuthor
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 * @param {Express.next} next - Express next function.
 */
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

/**
 * Middleware Function to check if a user is the author of a review.
 * @name isReviewAuthor
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 * @param {Express.next} next - Express next function.
 */
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


/**
 * A middleware function to check if a review information is valid.
 * @name validateReview
 * @function 
 * @inner
 * @param {callback} middleware - Express middleware.
 */
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}