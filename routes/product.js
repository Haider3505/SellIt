const router = require("express").Router();
const Product = require("../models/product");
const upload = require("../middlewares/upload-photo");

// POST- create a new product
// router.post("/products", upload.array("photo[]"), async (req, res) => {
router.post("/products", upload.single("photo"), async (req, res) => {
  try {
    let product = new Product({
      title: req.body.title,
      description: req.body.description,
      photo: req.file.path,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      rating: req.body.rating,
      ownerID: req.body.ownerID,
      categoryID: req.body.categoryID,
    });
    // console.log(req.body.photo[0].fieldname);

    // console.log(req.files);

    // if (req.files) {
    //   let path = "";
    //   req.files.forEach(function (files, index, arr) {
    //     path = path + files.path + ",";
    //   });
    //   path = path.substring(0, path.lastIndexOf(","));
    //   product.photo = path;
    // }

    await product.save();

    res.json({
      status: true,
      message: "Successfully created a new product",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET request - get all the produ
router.get("/products", async (req, res) => {
  try {
    let products = await Product.find()
      .populate("owner category")
      .populate("reviews", "rating")
      .exec();

    //sending response i.e status of the request and the data(products)
    res.json({
      success: true,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET request- get only a single product

router.get("/products/:id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id })
      .populate("owner category")
      .populate("reviews", "rating")
      .exec();

    //sending response i.e status of the request and the data(products)
    res.json({
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT request- Update a single product

router.put("/products/:id", upload.single("photo"), async (req, res) => {
  try {
    let updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          photo: req.file.path,
          price: req.body.price,
          stockQuantity: req.body.stockQuantity,
          category: req.body.categoryID,
          owner: req.body.ownerID,
          rating: req.body.rating,
        },
      },
      {
        upsert: true, // this will create a new entry if it didn't find an existing one
      }
    );

    //sending response i.e status of the request and the updated product
    res.json({
      success: true,
      updatedProduct: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE request- delete a single request

router.delete("/products/:id", async (req, res) => {
  try {
    let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    if (deletedProduct) {
      res.json({
        status: true,
        message: "Product deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
