const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Campground schema
 * @type {{title: String, price: String, description: String, location: String}}
 */
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);