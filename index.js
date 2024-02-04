const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { UserRouter } = require("./routes/user.routes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/users",UserRouter);

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