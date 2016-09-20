
var Mongoose = require('mongoose');

// Token schema
var TokenSchema = Mongoose.Schema({
    user: {
        type: Mongoose.Schema.ObjectId,
        ref: 'User'
    },
    token: {
        type: String
    }
});

var Token = module.exports = Mongoose.model('Token', TokenSchema);

module.exports.createToken = function (newToken, callback) {
    newToken.save(callback);
};

module.exports.getUserByToken = function(token, callback) {
    Token.findOne({ token: token }, callback).populate('user');
};

module.exports.deleteUserToken = function(token, callback){
    Token.remove({ token: token }, callback);
};
