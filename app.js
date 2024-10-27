const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const router = require("./Routes/index")

app.use(express.json());  // to parse json data

app.use(cors({origin : "*"}));

(async () => {
    mongoose.connect("mongodb://localhost:27017/userDB");

    app.use("/api", router);
    
    app.listen(3000, () => {
        console.log("listening on port 3000...");
    })

})()

module.exports = app;