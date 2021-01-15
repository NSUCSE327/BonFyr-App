const Campground = require('../models/campground');
const Wishlist = require('../models/wishlist');
var assert = require('assert');

/**
 * Route serving add wishlist.
 * @name get/campgrounds/campground_id/wishlist
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
module.exports.addToWishlist = async(req,res)=>{
    
    const wishlist = new Wishlist(req.body.wishlist);
    wishlist.id= await Campground.findById(req.params.id);
    await review.save();
    req.flash('success', 'Added To Wishlist!');;
    res.redirect(`/campgrounds/${campground._id}`);
}
/**
 * Route serving getting wishlist.
 * @name get/wishlist
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
module.exports.getWishlist = async (req, res) =>{
    const wishlists = Wishlist.find({});
    res.render('wishlist', { wishlists })
}