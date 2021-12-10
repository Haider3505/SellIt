const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/user");

dotenv.config();

// const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//connecing to the database
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },

  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to the database");
    }
  }
);

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// require APIs

const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/review");
const addressRoutes = require("./routes/address");
const paymentRoutes = require("./routes/payment");
const orderRoutes = require("./routes/order");
const searchRoutes = require("./routes/search");

app.use("/api", productRoutes);
app.use("/api", ownerRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes);
app.use("/api", addressRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api", searchRoutes);

// making images folder publically available

app.use("/images", express.static("images"));
// app.use(express.static("./images"));

// Server listening on port 3000
app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log("Listening on port", 3000);
});
