const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

// authorize.js
const authorize = (roles = []) => {
    // roles can be a single role string or an array
    if (typeof roles === "string") {
        roles = [roles];
    }

    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // check if user's role is allowed
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: "Forbidden: Access denied" });
            }
            next();
        } catch (err) {
            console.error("Authorization error:", err);
            res.status(500).json({ error: "Server error" });
        }
    };
};


module.exports = { authMiddleware, authorize };
