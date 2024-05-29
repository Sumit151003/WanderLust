const mongoose = require('mongoose');
const wrapAsync = require('../utils/wrapAsync');
const Schema = mongoose.Schema;
const Review = require('./reviewSchema.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String,
        url: String,
    },
    category:{
        type: String,
        enum: ['Amazing pools', 'Farms', 'Luxe', 'Tiny Homes', 'LakeFront', 'Beachfront', 'Cabins', 'Castles', 'Top of the world', 'Camping', 'Igloos', 'Trending', 'Bed & Breakfasts', 'Boats', 'Arctic', 'Golfing', 'Creative Spaces', 'Ski-in/out'],
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    geometry :{
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }     
    }
        
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log(res);
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;