const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
dotenv.config();

//Routes
const CarRoute = require("./routes/CarRoute");

//DB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("db connected"))
  .catch((e) => console.log("fucking error: " + e));

app.use(express.json());
app.use(cors());
app.use("/api/", CarRoute);

app.get("/", (req, res) => {
  res.send("Server is working...");
});

app.listen(4300, () => {
  console.log("Running on port 4300\n");
});
