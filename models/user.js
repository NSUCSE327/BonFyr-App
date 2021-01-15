/**
 * Module for User Model
 * @module models/user
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/**
 * @typedef {Object} User A User object
 * @property {string} email - email of a user
 * @property {string} username - username of a user
 */
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);