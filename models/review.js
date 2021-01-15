/**
 * Module for review model
 * @module models/review
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * @typedef {Object} reviewSchema Review Object
 * @property {string} body - text section of a review
 * @property {Number} rating - rating given in a review
 * @property {User} author - author of a review
 */
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);