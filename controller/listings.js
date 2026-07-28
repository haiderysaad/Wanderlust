const Listing = require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const alllisting=await Listing.find({});
    res.render("listings/index.ejs",{alllisting})
}

module.exports.renderNewForm=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be Logged in to Create Listings");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    console.log("MAP_TOKEN:", process.env.MAP_TOKEN);
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
    res.render("listings/show.ejs",{listing, mapToken: process.env.MAP_TOKEN});
};

module.exports.createListing=async(req,res)=>{
    console.log("TOKEN:", process.env.MAP_TOKEN);
    console.log("LOCATION:", req.body.listing.location);
    const geocodingClient = mbxgeocoding({ accessToken: process.env.MAP_TOKEN });
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    console.log(response.body.features);

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    if(req.file){
        newListing.image={
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
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

    res.render("listings/edit.ejs", { listing });
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
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
};