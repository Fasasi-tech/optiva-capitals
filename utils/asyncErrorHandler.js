module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500; // Default to 500 if no status code is set
            }
            next(err);
        });
    }
};
