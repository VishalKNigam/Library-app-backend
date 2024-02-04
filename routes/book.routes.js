const express = require("express");
const { BookModel } = require("../models/book.model");
const { rateLimiter } = require("../middlewares/rateLimiter.middleware");
const { auth } = require("../middlewares/auth.middleware");
const bookRouter = express.Router();

// Apply rate limiting middleware to all routes in the bookRouter
bookRouter.use(rateLimiter);

// Create a new Book
bookRouter.post("/create", auth, async (req, res) => {
    try {
        const roles = req.body.roles || [];

        // Check if the user has the "CREATOR" role
        if (roles.includes("CREATOR")) {
            const book = new BookModel({
                title: req.body.title,
                year: req.body.year,
                createdBy: req.body.createdBy,
                userID: req.body.userID,
                roles: roles,
            });

            await book.save();
            res.status(200).send({ "msg": `A new book has been added by ${req.body.createdBy}` });
        } else {
            // User is not authorized to add a book
            res.status(403).send({ "msg": "Unauthorized to add a book" });
        }
    } catch (error) {
        res.status(500).send({ "Error during POST request": error.message });
    }
});

// Get all books
bookRouter.get("/", auth, async (req, res) => {
    const roles = req.body.roles || [];
    try {
        // Check if the user has the "VIEW_ALL" or "CREATOR" role
        if (roles.includes("VIEW_ALL") || roles.includes("CREATOR")) {
            const books = await BookModel.find();
            res.status(201).send({ "All Books": books });
        } else if (roles.includes("VIEWER")) {
            // User has "VIEWER" role, only fetch their own books
            const books = await BookModel.find({ userID: req.body.userID });
            res.status(200).send({ "Books": books });
        }
    } catch (error) {
        res.status(500).send({ "Error during GET request": error.message });
    }
});

// Update a book by ID
bookRouter.patch("/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const book = await BookModel.findOne({ _id: id });

        if (!book) {
            // Book not found
            res.status(404).send({ msg: "Book not found" });
        }

        // Check if the user has the "CREATOR" role
        if (req.body.roles.includes("CREATOR")) {
            await BookModel.findByIdAndUpdate(
                { _id: id },
                {
                    title: req.body.title,
                    year: req.body.year,
                }
            );

            res.status(200).send({ msg: "Book has been updated" });
        } else {
            // User is not authorized to update this book
            res.status(403).send({ "msg": "You are not authorized to update this book" });
        }
    } catch (error) {
        res.status(500).send({ "Error during PATCH request": error.message });
    }
});

// Delete a book by ID
bookRouter.delete("/delete/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        const book = await BookModel.findOne({ _id: id });

        if (!book) {
            // Book not found
            return res.status(404).send({ msg: "Book not found" });
        }

        // Check if the user has the "CREATOR" role
        if (req.body.roles.includes("CREATOR")) {
            await BookModel.findByIdAndDelete({ _id: id });
            res.status(200).send({ msg: "Book has been deleted" });
        } else {
            // User is not authorized to delete this book
            res.status(403).send({ msg: "Unauthorized to delete this book" });
        }
    } catch (error) {
        res.status(500).send({ "Error during DELETE request": error.message });
    }
});

module.exports = { bookRouter };
