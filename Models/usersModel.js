const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone : {type : Number, allowNull : false, primaryKey : true},
    password : {type : String, allowNull : false},
    networth : {type : Number, defaultValue : 0, allowNull : false, },
    parentPhone : {type : Number, allowNull : false},
    childrenPhone : [Number],
    invests : {type : [{
        Bundle : {type : Number}, 
        Date : {type : String, allowNull : false}
    }], defaultValue : [], allowNull :false},
})

exports.User = mongoose.model('User', userSchema);