var mongoose = require('mongoose'),
    Bcrypt   = require('bcryptjs'),
    Config   = require('../config/config');

// User schema
var UserSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        index: true,
        required:true

    },
    password: {
        type: String,
        required:true
    },
    role: {
        type: [String],
        default: ['user']
    },
    confirmationToken: {
        type: String,
        default: ''
    },
    passwordResetToken: {
        type: String,
        default: ''
    },
    isVerified: {
        default: false,
        type: Boolean
    },
    isDeleted: {
        default: false,
        type: Boolean
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
    var self = this;
    if (this.password && this.isModified('password')) {
        Bcrypt.genSalt(10, function (err, salt) {
            Bcrypt.hash(self.password, salt, function (err, hash) {
                self.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

module.exports.createUser = function (newUser, callback) {
    newUser.save(callback);
};

module.exports.getUserByEmail = function(email, callback) {
    User.findOne({ email: email }, callback);
};

module.exports.getUserByConfirmationToken = function(token, callback) {
    User.findOne({ confirmationToken: token}, callback);
};

module.exports.getUserByPasswordResetToken = function(token, callback) {
    User.findOne({ passwordResetToken: token }, callback);
};

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getAllUsers = function(callback) {
    User.find({},
        {
            'password': 0,
            '_id': 0,
            '__v': 0,
            'isVerified': 0,
            'confirmationToken': 0,
            'passwordResetToken': 0
        }, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    Bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) {
            throw  err;
        }
        callback(null, isMatch);
    });
};

module.exports.updateConfirmationToken = function (confirmationToken, callback) {
    User.update({ $set: { confirmationToken: confirmationToken } }, callback);
};
