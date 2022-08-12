require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();

//helmet for security
const helmet = require("helmet");
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use("/public", express.static(path.join(__dirname + "./public")));

//cors
const corsOptions = require("./src/utils/corsOptions");
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//connecting databse
connectDB();

//to get data in req.body
app.use(express.json({ extended: false, limit: "50mb" }));

app.get("/", (req, res) => {
  return res.status(401).json({ msg: "Not Authorized" });
});

app.use("/api/auth", require("./src/routes/authRoute"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
