const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  headline: String,
  body: String,
  rating: Number,
  photo: String,
  productID: { type: Schema.Types.ObjectId, ref: "Porduct" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Review", ReviewSchema);
