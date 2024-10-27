const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const router = require("./Routes/index")

(async () => {
    mongoose.connect("mongodb://localhost:27017/userDB");

})

app.use(express.json());  // to parse json data
app.use(cors({origin : "*"}));
app.get("/", (req, res) => res.send("Welcome to the api server"));

app.use("/api", router);

app.listen(3000, () => {
    console.log("listening on port 3000...");
})()

module.exports = app;