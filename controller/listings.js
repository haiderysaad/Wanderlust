const Listing = require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const categories = require("../init/categories.js");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const requestedCategory = typeof req.query.category === "string" ? req.query.category : "";
    const currentCategory = categories.some(({ value }) => value === requestedCategory)
        ? requestedCategory
        : "";
    const searchTerm = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
    const conditions = [];

    if (currentCategory === "trending") {
        conditions.push({ featured: true });
    } else if (currentCategory === "rooms") {
        conditions.push({
            $or: [
                { category: "rooms" },
                { category: { $exists: false } }
            ]
        });
    } else if (currentCategory) {
        conditions.push({ category: currentCategory });
    }

    if (searchTerm) {
        const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchPattern = new RegExp(escapedSearch, "i");
        conditions.push({
            $or: [
                { title: searchPattern },
                { description: searchPattern },
                { location: searchPattern },
                { country: searchPattern }
            ]
        });
    }

    const filter = conditions.length ? { $and: conditions } : {};
    const alllisting = await Listing.find(filter).sort({ featured: -1, _id: -1 });
    res.render("listings/index.ejs", { alllisting, categories, currentCategory, searchTerm });
}

module.exports.renderNewForm=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be Logged in to Create Listings");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs", { categories });
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing You Requested Does not Exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing, mapToken: process.env.MAP_TOKEN, categories});
};

module.exports.createListing=async(req,res)=>{
    const geocodingClient = mbxgeocoding({ accessToken: process.env.MAP_TOKEN });
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    if(req.file){
        newListing.image={
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing You Requested Does not Exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing, categories });
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !=="undefined"){
        listing.image={
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
};