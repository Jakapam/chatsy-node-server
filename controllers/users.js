var jwt = require('jsonwebtoken');
var config = require('../config.js');

module.exports = function(router) {
    router.post('/login', function(req, res) {
        if( req.body.username === 'test' && req.body.password === 'test' ) {
            res.json({
                jwt: jwt.sign({
                    id: 1,
                }, config.JWT_SECRET, {expiresIn: "24h"})
            });
        } else {
            res.status(401).json({
                error: {
                    message: 'Wrong username or password!'
                }
            });
        }
    });

    return router;
}
