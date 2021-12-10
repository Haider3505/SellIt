const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  fullName: String,
  country: String,
  city: String,
  state: String,
  streetAddress: String,
  zipCode: Number,
  phoneNumber: Number,
  deliverInstructions: String,
  securityCode: String,
});

module.exports = mongoose.model("Address", AddressSchema);
