const mongoose = require('mongoose');

const suSchema = mongoose.Schema({
    password : String,

    notifications : [{
        transactionType: String,
        amount: Number,
        date: String,
        phone : Number,
        password: String,
        transactionId: {type: String, unique: true},
        processed: Boolean,
    }]
})


exports.Su = mongoose.model("Su", suSchema);