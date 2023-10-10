const mongoose = require("mongoose");

const userSchema2 = new mongoose.Schema({
    phone1: {
        type: Number,
        required:true
    },
    phone2: {
        type: Number,
    },
    phone3: {
        type: Number,
    }
})


const sosN = new mongoose.model("sosNu", userSchema2);
module.exports = sosN;