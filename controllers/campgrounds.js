const Campground = require('../models/campground');

/**
 * @swagger
 * Function to list all campgrounds.
 * @name index
 * @async
 * @function
 * @param {object} req - Http Req object
 * @param {object} res - Http Res object.
 */
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

/**
 * Function to render new camp form.
 * @name renderNewForm
 * @function
 * @param {object} req - Http Req object
 * @param {object} res - Http Res object.
 */
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

/**
 * Function to create a nw campground.
 * @name createCampground
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {object} res - Http Res object.
 * @param {object} next - Http next object.
 */
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Function to show camp info page.
 * @name showCampground
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

/**
 * Function to show camp info page.
 * @name renderEditForm
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

/**
 * Function to show camp info page.
 * @name updateCampground
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Function to show camp info page.
 * @name deleteCampground
 * @function
 * @async
 * @param {object} req - Http Req object
 * @param {callback} res - Http Res object.
 */
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}