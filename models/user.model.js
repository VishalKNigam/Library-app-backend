const mongoose = require("mongoose");

// UserSchema for Users
let userScheama = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ["VIEWER"],
        required: true
    }
}, {
    versionKey: false
});

// UserModel for Users

const userModel = mongoose.model("user", userScheama);
module.exports = { userModel };
