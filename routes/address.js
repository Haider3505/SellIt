const router = require("express").Router();
const axios = require("axios");
const Address = require("../models/address");
const User = require("../models/user");
const verifyToken = require("../middlewares/verify-token");

// POST request - create an address

router.post("/addresses", verifyToken, async (req, res) => {
  try {
    const address = new Address({
      user: req.decoded._id,
      fullName: req.body.fullName,
      country: req.body.country,
      city: req.body.city,
      state: req.body.state,
      streetAddress: req.body.streetAddress,
      zipCode: req.body.zipCode,
      phoneNumber: req.body.phoneNumber,
      deliverInstructions: req.body.deliverInstructions,
      securityCode: req.body.securityCode,
    });

    await address.save();

    res.json({
      success: true,
      message: "Successfully added an address",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get req - get all addresses

router.get("/addresses", verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.decoded._id });

    res.json({
      success: true,
      addresses: addresses,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get req - get a single addresses

router.get("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id });

    res.json({
      success: true,
      address: address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get API - for getting all the countries from third party API

router.get("/countries", async (req, res) => {
  try {
    const response = await axios.get("https://restcountries.com/v2/all");

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PUT request- Update an address

router.put("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const foundAddress = await Address.findOne({ _id: req.params.id });

    if (foundAddress) {
      if (req.body.fullName) foundAddress.fullName = req.body.fullName;
      if (req.body.country) foundAddress.country = req.body.country;
      if (req.body.city) foundAddress.city = req.body.city;
      if (req.body.state) foundAddress.state = req.body.state;
      if (req.body.streetAddress)
        foundAddress.streetAddress = req.body.streetAddress;
      if (req.body.zipCode) foundAddress.zipCode = req.body.zipCode;
      if (req.body.phoneNumber) foundAddress.phoneNumber = req.body.phoneNumber;
      if (req.body.deliverInstructions)
        foundAddress.deliverInstructions = req.body.deliverInstructions;
      if (req.body.securityCode)
        foundAddress.securityCode = req.body.securityCode;
    }

    await foundAddress.save();

    res.json({
      success: true,
      message: "successfully Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE request- delete a single address

router.delete("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let deletedAddress = await Address.remove({
      user: req.decoded._id,
      _id: req.params.id,
    });
    if (deletedAddress) {
      res.json({
        success: true,
        message: "Address deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// set default address API

router.put("/addresses/set/default", verifyToken, async (req, res) => {
  try {
    const setDefaultAddress = await User.findOneAndUpdate(
      { _id: req.decoded._id },
      {
        $set: { address: req.body.id },
      }
    );

    if (setDefaultAddress) {
      res.json({
        success: true,
        message: "successfully set address as default",
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
