const mongoose = require("mongoose");
const ListingSchema = new mongoose.Schema({
  title: String,
  datePosted: Date,
  neighborhood: String,
  url: String,
  jobDescription: String,
  compensation: String,
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
