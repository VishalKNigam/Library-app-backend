const jwt = require("jsonwebtoken");
require("dotenv").config();
// auth middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            // Verify the JWT token
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (decoded) {
                    // If the token is valid, attach userID and roles to the request body
                    req.body.userID = decoded.userID;
                    req.body.roles = decoded.roles;
                    next();
                } else {
                    // If the token is not valid, send an unauthorized message
                    res.status(401).send({ "message": "You are not authorized" });
                }
            });
        } catch (error) {
            // Handle token verification errors
            res.status(400).send({ "error": error.message });
        }
    } else {
        // If no token is provided, send a message to login
        res.status(400).send({ "msg": "Please Login!" });
    }
};

module.exports = { auth };
