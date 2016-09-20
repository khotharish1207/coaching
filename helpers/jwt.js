var JWT = require('jsonwebtoken'),

    jwtSecret = require('../config/secrets').jwtSecret,
    stringConstant = require('../helpers/string-constants');

module.exports = {
    getConfirmationToken: function(user) {
        return JWT.sign(user, jwtSecret, {
            expiresIn: stringConstant.TOKEN_EXPIRATION_TIME
        });
    },

    getResetPasswordToken: function(email) {
        return JWT.sign({ email: email }, jwtSecret, {
            expiresIn: stringConstant.TOKEN_EXPIRATION_TIME
        });
    },

    getLoginToken: function(user) {
        return JWT.sign(user, jwtSecret, {
            expiresIn: stringConstant.TOKEN_EXPIRATION_TIME
        });
    },

    isValidToken: function(token, callback) {
        JWT.verify(token, jwtSecret, callback);
    }

};
