var Express = require('express'),
    Router = Express.Router(),
    Passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,

    // Custom include
    users = require('../models/user'),
    logger = require('../models/logger'),
    apiHandler = require('../services/api-handler'),
    appConfig = require('../config/config'),
    stringConstant = require('../helpers/string-constants'),
    jWT = require('../helpers/jwt'),
    authToken = require('../models/auth-token'),
    mailer = require('../mailer/mailer');

// register user
Router.post('/register', function (req, res) {
    var bodyParams = req.body,
        name = bodyParams.name,
        email = bodyParams.email,
        password = bodyParams.password,
        passwordConfirm = bodyParams.passwordConfirm,
        emailRegex = new RegExp(stringConstant.VALID_EMAIL_REGEX),
        newUser, confirmationToken, confirmationUrl;

    if (!name || !email || !password) {
        res.send(apiHandler.generateErrorResponse('REGISTRATION_FIELDS_MISSING'));
    } else if (!emailRegex.test(email)) {
        res.send(apiHandler.generateErrorResponse('INVALID_EMAIL_ADDRESS'));
    } else if (password && password !== passwordConfirm) {
        res.send(apiHandler.generateErrorResponse('CONFIRM_PASSWORD_NOT_SAME'));
    } else {
        newUser = new users(bodyParams);
        users.createUser(newUser, function (err, user) {
            if (err) {
                if (err.code === 11000) {
                    res.send(apiHandler.generateErrorResponse('EMAIL_ALREADY_EXIST'));
                } else {
                    res.send(apiHandler.generateErrorResponse('UNKNOWN_ERROR'));
                }
            } else {
                    confirmationUrl = '/users/confirm?id=' + user._id;
                    mailer.sendConfirmationMail(name, email, confirmationUrl)
                        .then(function (success) {
                            req.flash('success_msg', "User created");
                            res.redirect('/login');
                        })
                        .catch(function (err) {
                            user.remove();
                            req.flash('error_msg', "Error in user creation");
                            res.redirect('/register');
                        });
                    }
        });
    }
});

//  Local authentication
Passport.use(new LocalStrategy(
    function (email, password, done) {
        users.getUserByEmail(email, function (err, user) {
            // TODO: Remove throw, use error handling
            if (err) throw  err;
            if (!user) {
                return done(null, false, {message: "INVALID_USER"});
            }
            users.comparePassword(password, user.password, function (err, isMatch) {
                if (err) {
                    return done(null, false, {message: "flash_UserDeleted_msg"});
                } else {
                    // Check if given password is correct.
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                }
            });
        });
    }
));

Router.post('/login',
    Passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash: true }
    ),
    function(req, res) {
        console.log(req.user);
        res.redirect('/');
    }
);


Passport.serializeUser(function (user, done) {
    done(null, user.id);
});

Passport.deserializeUser(function (id, done) {
    users.getUserById(id, function (err, user) {
        done(err, user);
    });
});

/*
Router.post('/getAllUsers', function (req, res) {
    users.getAllUsers(function (err, users) {
        if (err) {
            res.send(apiHandler.generateErrorResponse('NO_USERS'));
        } else {
            res.send(apiHandler.generateSuccessResponse('USER_LIST', users));
        }
    });
});

Router.post('/activate/:id', function (req, res) {
    users.getUserById(req.params.id, function (err, user) {
        if (err) {
            res.send(apiHandler.generateErrorResponse('INVALID_USER'));
        } else {
            user.isActive = true;
            user.save(function (err) {
                if (err) {
                    var errorLog = new logger({
                        details: err,
                        activity: stringConstant.ACTIVATION_ACTIVITY
                    });
                    errorLog.save();
                }
            });
            res.send(apiHandler.getSuccessMessage('USER_ACTIVATED'));
        }
    });
});

Router.post('/deactivate/:id', function (req, res) {
    users.getUserById(req.params.id, function (err, user) {
        if (err) {
            res.send(apiHandler.generateErrorResponse('INVALID_USER'));
        } else {
            user.isActive = false;
            user.save(function (err) {
                if (err) {
                    var errorLog = new logger({
                        details: err,
                        activity: stringConstant.DEACTIVATION_ACTIVITY
                    });
                    errorLog.save();
                }
            });
            res.send(apiHandler.getSuccessMessage('USER_DEACTIVATED'));
        }
    });
});

Router.post('/changepassword', function (req, res) {
    var reqBody = req.body,
        email = req.user.email,
        oldPassword = reqBody.old_password,
        newPassword = reqBody.new_password,
        newPasswordConfirm = reqBody.new_password_confirm;

    if (newPassword === newPasswordConfirm) {
        users.getUserByEmail(email, function (err, user) {
            users.comparePassword(oldPassword, user.password, function (err, isMatch) {
                if (err) {
                    res.send(apiHandler.getErrorMessage('ERROR_IN_UPDATE_PASSWORD'));
                } else {
                    // Check if given password and current password is same.
                    if (isMatch) {
                        user.password = newPassword;
                        user.save(function (err) {
                            if (err) {
                                var errorLog = new logger({
                                    details: err,
                                    activity: stringConstant.PASSWORD_CHANGE_ACTIVITY
                                });
                                errorLog.save();
                            }
                        });
                        res.send(apiHandler.getSuccessMessage('PASSWORD_UPDATED'));
                    } else {
                        res.send(apiHandler.getErrorMessage('PASSWORD_DOES_NOT_MATCH'));
                    }
                }
            });
        });
    } else {
        res.send(apiHandler.generateErrorResponse('CONFIRM_PASSWORD_NOT_SAME'));
    }
});
*/
Router.get('/confirm', function (req, res) {
    users.getUserById(req.query.id, function (err, user) {
        if (err) {
            var errorLog = new logger({
                details: err,
                activity: "account confirmation"
            });
            errorLog.save();
            req.flash('error_msg', StringConstants.flash_invalidToken_msg);
            res.redirect("/login")
        }
        user.isVerified = true;
        user.save(function (err) {
            if (err) {
                if (err) {
                    var errorLog = new logger({
                        details: err,
                        activity: "account confirmation"
                    });
                    errorLog.save();
                }
                req.flash('error_msg', StringConstants.flash_invalidToken_msg);
                res.redirect("/login");
            }
            res.redirect("/login");
        });
    });
});

/*
Router.post('/forgotpassword', function (req, res) {
    var reqBody = req.body,
        email = reqBody.email,
        passwordResetUrl,
        passwordResetToken;

    users.getUserByEmail(email, function (err, user) {
        if (err || !user) {
            res.send(apiHandler.getErrorMessage('INVALID_USER'));
        } else {
            if (user.passwordResetToken) {
                passwordResetToken = user.passwordResetToken;
            } else {
                passwordResetToken = jWT.getResetPasswordToken(email);
                user.passwordResetToken = passwordResetToken;
                user.save(function (err) {
                    if (err) {
                        var errorLog = new logger({
                            details: err,
                            activity: stringConstant.FORGOT_PASSWORD_ACTIVITY
                        });
                        errorLog.save();
                    }
                });
            }

            passwordResetUrl = '/#/passwordreset?token=' + passwordResetToken + '&user_id=' + user._id;

            mailer.sendPasswordResetMail(email, passwordResetUrl)
                .then(function (success) {
                    res.send(apiHandler.getSuccessMessage('PASSWORD_RESET_MAIL_SENT'));
                })
                .catch(function (err) {
                    user.remove();
                    res.send(apiHandler.getErrorMessage('ERROR_WHILE_MAIL_SENDING'));
                });
        }
    });
});

Router.post('/passwordreset', function (req, res) {
    console.log('req.query: ',req.query);
    var reqBody = req.body,
        newPassword = reqBody.new_password,
        newPasswordConfirm = reqBody.new_password_confirm,
        token = req.headers.token || req.headers['x-access-token'];

    jWT.isValidToken(token, function (err, decoded) {
        if (err) {
            res.send(apiHandler.generateErrorResponse('INVALID_TOKEN'));
        } else {
            if (newPassword && newPassword === newPasswordConfirm) {
                users.getUserById(req.query.user_id, function (err, user) {
                    // TODO: Remove throw, use error handling.
                    if (err) throw err;
                    else if (user.passwordResetToken !== token) {
                        console.log('pass cheeck');
                        res.send(apiHandler.generateErrorResponse('TOKEN_EXPIRED'));
                    } else {
                        user.password = newPassword;
                        user.passwordResetToken = '';
                        user.save(function (err) {
                            if (err) {
                                var errorLog = new logger({
                                    details: err,
                                    activity: stringConstant.PASSWORD_RESET_ACTIVITY
                                });
                                errorLog.save();
                            }
                        });
                        res.send(apiHandler.getSuccessMessage('PASSWORD_UPDATED'));
                    }
                });
            } else {
                res.send(apiHandler.getErrorMessage('CONFIRM_PASSWORD_NOT_SAME'));
            }
        }
    });
});

Router.post('/logout', function (req, res) {
    var token = req.headers.token || req.headers['x-access-token'];
    authToken.deleteUserToken(token, function (err, users) {
        if (err) {
            res.send(apiHandler.getErrorMessage('PLEASE_TRY_AGAIN'));
        }
        else {
            req.logout();
            res.send(apiHandler.getSuccessMessage('LOGOUT_SUCCESS'));
        }
    });
});
*/
module.exports = Router;
