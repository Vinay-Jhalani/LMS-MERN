require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went Wrong",
  });
});

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      console.log(`MongoDB also connected`);
    })
  )
  .catch((e) => console.log(e));

//routes configuration
app.use("/auth", authRoutes);
