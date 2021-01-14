/**
 * User
 * @type User Type
 */
const User = require('../models/user');

/**
 * Shows Register form
 * @name renderRegister
 * @function
 * @sync
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

/**
 * Function to register
 * @name register
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 * @param {callback} next - Http Next object.
 */

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
/**
 * Shows Register form
 * @name renderLogin
 * @function
 * @sync
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}
/**
 * Function to login
 * @name login
 * @function
 * @sync
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
/**
 * Function to logout
 * @name logout
 * @function
 * @sync
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}