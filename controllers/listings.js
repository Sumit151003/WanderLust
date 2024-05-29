const Listing = require("../models/listingSchema");

let requestOptions = {method: 'GET'};
let geoapifyUrl = "https://api.geoapify.com/v1/geocode/search?text=";
let apiKey = process.env.GEOAPIFY_API_KEY;

async function fetchCoordinates(location){
    let response = await fetch(`${geoapifyUrl+location}&apiKey=${apiKey}&limit=1`, requestOptions);
    response = await response.json();
    return response.features[0].geometry;
}

module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});
    return res.render("listings/home.ejs", {title: "WanderLust | Home - All listings", allListings});
};

module.exports.renderNewForm = (req, res)=>{
    return res.render("listings/newListing.ejs", {title: "WanderLust | Create new listing"});
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate(
        {
            path: "reviews", 
            populate: {
                path: "createdBy"
            }
        }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exit");
        return res.redirect("/listings");
    }
    return res.render("listings/showListing.ejs", {title: "WanderLust | About this listing", listing});
};

module.exports.createNewListing = async(req, res)=>{
    let {path: url, filename} = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.image = {filename, url}
    newListing.owner = req.user._id;

    let result = await fetchCoordinates(newListing.location);
    let {type, coordinates} = result;

    newListing.geometry.type = type;
    newListing.geometry.coordinates = coordinates.reverse();

    console.log(newListing);

    await newListing.save();
    req.flash("success", "New listing created");
    return res.redirect("/listings");
};

module.exports.searchListing = async(req, res)=>{
    let {location} = req.query;
    let searchedListings = await Listing.find({location: `${location}`});
    if(!searchedListings.length){
        req.flash("error", `No listings found for ${location}`);
        return res.redirect('/listings');
    }
    res.render('listings/search.ejs', {title : "WanderLust | Search Results", searchedListings});
}

module.exports.filteredListing = async(req, res)=>{
    let {category} = req.query;
    let filteredListings = await Listing.find({category: `${category}`});
    if(!filteredListings.length){
        req.flash("error", `No listings found for ${category}`);
        return res.redirect('/listings');
    }
    res.render('listings/filter.ejs', {title : "WanderLust | Search Results", filteredListings});
}

module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exit");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250,h_100");
    return res.render("listings/editListing.ejs", {title: "WanderLust | Edit listing" , listing, originalUrl});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    let {location} = req.body.listing;

    let updatedCoordinates = await fetchCoordinates(location);
    let {type , coordinates} = updatedCoordinates;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing, geometry: {type, coordinates: coordinates.reverse()}});
    if(req.file){
        let {path: url, filename} = req.file;
        listing.image = {filename, url};
        await listing.save();
    }
    req.flash("success", "Listing updated successfully");
    return res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    return res.redirect("/listings");
};
