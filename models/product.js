const mongoose = require("mongoose");
const mongooseAlgolia = require("mongoose-algolia");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    owner: { type: Schema.Types.ObjectId, ref: "Owner" },
    title: String,
    description: String,
    photo: String,
    price: Number,
    stockQuantity: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);

// ProductSchema.virtual("averageRating").get(function () {
//   console.log("sadvajvda" + this.reviews);
//   if (this.reviews.length > 0) {
//     // let sum = this.reviews.reduce((total, review) => {
//     //   return total + review.rating;
//     // }, 0);
//     let averageRating = 0;
//     let sum = 0;
//     let test = 9 / 3;
//     console.log("reviews length" + this.reviews.length);
//     console.log("review[0].rating : " + this.reviews[0].rating);
//     for (let i = 0; i < this.reviews.length; i++) {
//       sum += this.reviews[i].rating;
//       console.log("in loop i :" + i + " rating : " + this.reviews[i].rating);
//     }
//     averageRating = sum / this.reviews.length;
//     console.log("average rating : " + averageRating);
//     console.log("test rating : " + test);
//     return averageRating;
//   }
//   return 0;
// });

// Algolia

ProductSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET_KEY,
  indexName: process.env.ALGOLIA_INDEX,
  selector:
    "title _id photo description price rating averageRating owner category.type",
  populate: {
    // path: "owner reviews",
    path: "owner reviews category",
    // select="name"
  },
  debug: true,
});

const Model = mongoose.model("Product", ProductSchema);

Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  // searchableAttributes: ["title"],
  searchableAttributes: ["title", "category.type"],
});

module.exports = Model;
