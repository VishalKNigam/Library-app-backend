const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title: String,
    year: Number,
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    userID: String,
    roles: [String]
}, {
    versionKey: false
})

const BookModel = mongoose.model("book", bookSchema);

module.exports = {
    BookModel
}