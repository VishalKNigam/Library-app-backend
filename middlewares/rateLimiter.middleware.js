// rateLimitMiddleware.js
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // 100 requests per 10 minutes
    standardHeaders: 'draft-7', // Use headers compliant with the latest draft
    legacyHeaders: false,
});

module.exports = {
    rateLimiter
};
