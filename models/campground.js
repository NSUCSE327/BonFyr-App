/**
 * Module for campground model
 * @module models/campground
 */

const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
/**
 * A Campground Schema
 * @typedef {Object} CampgroundSchema 
 * @property {string} title - A campground name
 * @property {string} image - Image url of a campground
 * @property {Number} price - Price of a Campground
 * @property {string} description - Description of a campground
 * @property {string} location - Location Detail of a campground
 * @property {string} author - Author of a campground
 * @property {string[]} reviews - List of reviews for the campground
 */
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);