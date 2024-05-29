const mongoose = require('mongoose');
const Listing = require('../models/listingSchema.js');
const initData = require('./data.js');

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const initDB = async()=>{
    // delete all listings in the database
    await Listing.deleteMany({});
    // create new listing objects from sample
    initData.data = initData.data.map((obj)=>({...obj, owner: '6645b6357b6f26607d2b1dff', geometry: {type: 'Point', coordinates: [19.0760, 72.8777]}}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized successfully");
}

initDB();


