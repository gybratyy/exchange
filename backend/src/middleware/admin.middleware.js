export const protectModerator = (req, res, next) => {
    if (req.user && (req.user.role === 'moderator' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({message: "Access denied. Requires moderator or admin privileges."});
    }
};

export const protectAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({message: "Access denied. Requires admin privileges."});
    }
};
