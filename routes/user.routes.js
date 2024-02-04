const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
const UserRouter = express.Router();

// Registration

UserRouter.post("/register", async (req, res) => {
    const { username, email, pass, roles } = req.body;
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                res.status(200).send({ "Error During Hashing": err });
            } else {
                const user = new userModel({
                    username, email, pass: hash, roles
                })
                await user.save();
                res.status(200).send({ "msg": "The New User has been registered successfully!", "New User": user });
            }
        })

    } catch (error) {
        console.log("Error during registration", error);
        res.status(400).send({ "Error during Registration": error })
    }
})

// login

UserRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        // Search the user in the DB
        const user = await userModel.findOne({ email });

        if (user) {
            bcrypt.compare(pass, user.pass, (err, result) => {
                if(result){
                    const token = jwt.sign(
                        {
                            userID: user._id,
                            username: user.username,
                            roles: user.roles,
                        },"masai", {expiresIn: "1hr"}
                    );
                    res.status(200).send({"msg": "Login Successfully!", token: token, roles:user.roles });
                }
            })
        } else {
            res.status(400).send({ "msg": "User does not Exists" });
        }

    } catch (error) {
        console.log("Error during Login", error);
        res.status(400).send({ "Error during Login": error });
    }
})
module.exports = {UserRouter};