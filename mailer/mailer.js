var Nodemailer = require('nodemailer'),
    Promise = require('bluebird'),
    mailConfig = require('../config/config'),
    mailConstants = require('../helpers/mail-constants'),
    util = require('../helpers/util');

// create reusable transporter object using the default SMTP transport
var transporter = Nodemailer.createTransport([
    'smtps://',
    mailConfig.mailServer.user_id,
    ':',
    mailConfig.mailServer.password,
    '@smtp.gmail.com'
].join(''));

module.exports = {
    sendConfirmationMail: function(username, email, confirmationUrl) {
        var confirmationLink = mailConfig.appClient.baseUrl + confirmationUrl,
            mailBody = util.formMailBody('REGISTRATION_BODY', {
                username: username,
                confirmationLink: confirmationLink
            }),
            mailOptions = {
                from: mailConfig.mailServer.user_id, // sender address
                to: email, // list of receivers
                subject: mailConstants.REGISTRATION_SUBJECT, // Subject line
                html: mailBody // html body
            };

        // send mail with defined transport object
        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return reject(error);
                } else {
                    return resolve(info.response);
                }
            });
        });
    },

    sendPasswordResetMail: function(email, resetUrl) {
        var resetLink = mailConfig.appClient.baseUrl + resetUrl,
            mailBody = util.formMailBody('PASSWORD_RESET_BODY', {
                email: email,
                resetLink: resetLink
            }),
            mailOptions = {
                from: mailConfig.mailServer.user_id, // sender address
                to: email, // list of receivers
                subject: mailConstants.PASSWORD_RESET_SUBJECT, // Subject line
                html: mailBody // html body
            };

        // send mail with defined transport object
        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function(error, info){
                if(error) {
                    return reject(error);
                } else {
                    return resolve(info.response);
                }
            });
        });
    }
};
