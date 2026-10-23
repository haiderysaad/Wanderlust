require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const featuredListings = require("./featuredListings.js");

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
    throw new Error("ATLASDB_URL environment variable is required");
}

async function seedFeaturedListings() {
    await mongoose.connect(dbUrl);

    let added = 0;
    for (const listing of featuredListings) {
        const exists = await Listing.exists({
            title: listing.title,
            location: listing.location
        });
        if (!exists) {
            await Listing.create(listing);
            added += 1;
        }
    }

    console.log(`Added ${added} featured stays.`);
}

seedFeaturedListings()
    .catch((error) => {
        console.error("Failed to seed featured stays:", error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
