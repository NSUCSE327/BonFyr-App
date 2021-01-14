/**
 * UserSchema type object
 * @const {object}
 */
const User = require('../models/user');
/**
 * requiring nodemailer
 * @const {object}
 */
const nodemailer = require('nodemailer');

/**
 * Nodemailer function to set up host mail authentication .
 * @name nodemailer.createTransport
 * @function
 * @param {object}  - object containing auth information
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'faker9725@gmail.com',
        pass: '21TonystanK25!!'
    }
});

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}

/**
 * Function to show user info page.
 * @name showUser
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.showUser = async (req, res) => {
    const user = await User.findById(req.params.id); 
    if(!user){
            req.flash("error", "User not found!");
            res.redirect("/");
        }
    console.log(user);
    res.render("users/show", { user });
}

/**
 * Function to generate mail form.
 * @name renderMail
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.renderMail = async (req, res) => {
    const user = await User.findById(req.params.id); 
    if(!user){
            req.flash("error", "User not found!");
            res.redirect("/");
        }
    console.log(user);
    res.render("users/mail", { user });
}

/**
 * Function to send mail.
 * @name sendMail
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.sendMail = async (req, res) => {
    const user = await User.findById(req.params.id); 
    if(!user){
            req.flash("error", "User not found!");
            res.redirect("/");
        }
    const mailOptions = {
        from: 'faker9725@gmail.com',
        to: user.email,
        subject: "BonFyr: from "+req.user.username,
        text: req.body.body
    }


    /**
 * Function to show camp info page.
 * @name showCampground
 * @function
 * @inner
 * @param {object} mailOptions - object containing mail required info
 * @param {callback} unnamed - callback function to send mail
 */
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else{
            console.log('Email sent: ' + info.response);
            req.flash("success", "Email sent successfully!");
            res.redirect('/campgrounds');
        }
    })
    
}
