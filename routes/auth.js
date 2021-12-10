const router = require("express").Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");
// const { response } = require("express");
const verifyToken = require("../middlewares/verify-token");

// signup route

router.post("/auth/signup", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(403).json({
      success: false,
      message: "Please enter valid email and password",
    });
  } else {
    // chechk whether email is already registered or not
    const foundUser = await User.findOne({ email: req.body.email });
    // if not found sign up
    if (!foundUser) {
      try {
        let newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        await newUser.save();

        // let token = jwt.sign(newUser.toJSON(), process.env.ENCRYPTION_KEY, {
        //   expiresIn: 604800, // 1 week
        // });

        res.json({
          success: true,
          // token: token,
          message: "Successfully created a new User",
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      }
    } else {
      res.status(403).json({
        success: false,
        message: "Email already exists!!!",
      });
    }
  }
});

// Profile Route

router.get("/auth/user", verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.decoded._id }).populate("address");
    if (user) {
      res.json({
        success: true,
        user: user,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Update a Profile

router.put("/auth/user", verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.decoded._id });
    if (user) {
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      user.save();
      res.json({
        success: true,
        message: "Successfully updated",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Login route

router.post("/auth/login", async (req, res) => {
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(403).json({
        success: false,
        message: "Authentication failed, user not found",
      });
    } else {
      if (foundUser.comparePassword(req.body.password)) {
        let token = jwt.sign(foundUser.toJSON(), process.env.ENCRYPTION_KEY, {
          expiresIn: 604800,
        });
        res.json({
          success: true,
          token: token,
          user: foundUser,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Authentication Failed, wrong password",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
