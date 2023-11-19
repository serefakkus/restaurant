const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token
    if (!token) {
        res.status(400).send("no token")
        return
    }

    jwt.verify(token,req.app.get('rest_api_secret_key'),(err,decoded) => {
        if (err) {
            console.log(err)
            res.status(401).send("failed to authenticate token");
            return
        }
        req.decode = decoded
        if (req.decode.Tip !== 0) {
            console.log(12)
            res.status(401).send("failed to authenticate token");
            return
        }
        next()
    });
};