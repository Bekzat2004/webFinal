// src/middleware/authorization.js

const authorize = (role) => {
    return (req, res, next) => {
        const userRole = req.user && req.user.role;

        if (userRole === role) {
            next();
        } else {
            res.status(403).json({ error: 'Access forbidden' });
        }
    };
};

module.exports = authorize;
