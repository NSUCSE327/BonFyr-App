/**
 * Module for all campground controller functions
 * @module controllers/campgrounds
 */
const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
/**
 * Function to list all campgrounds.
 * @name index
 * @async
 * @function
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 */
module.exports.index = async (req, res) => {
    var search = '';
    if(req.query.search){
        search = req.query.search;
        const campgrounds = await Campground.fuzzySearch(req.query.search);
        res.render('campgrounds/index', { campgrounds, search })
    }else{
        const campgrounds = await Campground.find({}).populate('popupText');
        res.render('campgrounds/index', { campgrounds, search })
    }
   
}

/**
 * Function to render new camp form.
 * @name renderNewForm
 * @function
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 */
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

/**
 * Function to create a nw campground.
 * @name createCampground
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 * @param {Express.next} next - Express next function.
 */
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Function to show camp info page.
 * @name showCampground
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
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
 * Function to edit camp info page.
 * @name renderEditForm
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
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
 * Function to update camp info page.
 * @name updateCampground
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 */
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

/**
 * Function to delete camp info page.
 * @name deleteCampground
 * @function
 * @async
 * @param {Express.req} req - Express Req object
 * @param {Express.res} res - Express Res object.
 */
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}