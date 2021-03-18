const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.KEY)
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        if(!error.message){
            error.message = 'TOKEN VERFICATION FAILED'
        }
        next(error);
    }

    next();
}