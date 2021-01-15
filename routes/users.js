/**
 * Module for all User Routes
 * @module routes/users
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

router.get('/users/:id', users.showUser)
router.post('/users/:id', users.sendMail)
router.get('/users/:id/contact', users.renderMail)
module.exports = router;