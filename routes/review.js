const router = require("express").Router();
const Review = require("../models/review");
const Product = require("../models/product");
const upload = require("../middlewares/upload-photo");
const verifyToken = require("../middlewares/verify-token");

// POST request

router.post(
  "/reviews/:productID",
  [verifyToken, upload.single("photo")],
  async (req, res) => {
    try {
      const review = new Review({
        headline: req.body.headline,
        body: req.body.body,
        rating: req.body.rating,
        photo: req.file.path,
        user: req.decoded._id,
        productID: req.params.productID,
      });

      // await Product.updateOne({ $push: { reviews: review._id } });

      await Product.findOneAndUpdate(
        { _id: req.params.productID },
        {
          $set: {
            reviews: review._id,
            // reviews: review,
          },
        },
        {
          upsert: false, // this will create a new entry if it didn't find an existing one
        }
      );

      const savedReview = await review.save();

      if (savedReview) {
        res.json({
          success: true,
          message: "Successfully added a review",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

// GET request -

router.get("/reviews/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
      productID: req.params.productID,
    })
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: productReviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//
// router.get("/reviews/:productID", async (req, res) => {
//   try {
//     const productReviews = await Review.find({
//       productID: req.params.productID,
//     })
//       .populate("user")
//       .exec();

//     res.json({
//       success: true,
//       reviews: productReviews,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

module.exports = router;
