const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { UserRouter } = require("./routes/user.routes");
const { bookRouter } = require("./routes/book.routes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/users",UserRouter);
app.use("/books", bookRouter);

//Connection to the Database and PORT
app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Successfully connected to the DB");
        console.log(`Successfully connected to the PORT ${process.env.PORT}`);
    } catch (err) {
        console.log("Error During Connection", err);
    }
})