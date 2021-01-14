const User = require('../models/user');
const nodemailer = require('nodemailer');

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

module.exports.showUser = async (req, res) => {
    const user = await User.findById(req.params.id); 
    if(!user){
            req.flash("error", "User not found!");
            res.redirect("/");
        }
    console.log(user);
    res.render("users/show", { user });
}

module.exports.renderMail = async (req, res) => {
    const user = await User.findById(req.params.id); 
    if(!user){
            req.flash("error", "User not found!");
            res.redirect("/");
        }
    console.log(user);
    res.render("users/mail", { user });
}

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
// module.exports.showCampground = async (req, res,) => {
//     const campground = await Campground.findById(req.params.id).populate({
//         path: 'reviews',
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/show', { campground });
// }