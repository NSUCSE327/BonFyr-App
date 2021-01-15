const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


const wishlists = require('../controllers/wishlists');
const Campground = require('../models/wishlist');




router.post('/',wishlists.addToWishlist);
router.get('/get-data',wishlists.getWishlist);





module.exports = router;
