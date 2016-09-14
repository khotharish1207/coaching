var mongoose = require('mongoose'),
    Bcrypt   = require('bcryptjs'),
    Config   = require('../config/config');

var defaultProfileImage = Config[Config.server].host + ':' + Config[Config.server].port + '/images/defaultIcon.png';

// User schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    isValid: {
        default: false,
        type: Boolean
    },
    isDeleted: {
        default: false,
        type: Boolean
    },
    profileImage: {
        default: defaultProfileImage,
        type: String
    },
    isAdmin: {
        default: false,
        type: Boolean
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    Bcrypt.genSalt(10, function(err, salt) {
        Bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserByEmail = function(email, callback){
    var query = {'email': email};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.getAllUsers = function(callback){
    User.find({}, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    Bcrypt.compare(candidatePassword, hash, function(err, isMatch){
       if(err) throw  err;
        callback(null, isMatch);
    });
};
