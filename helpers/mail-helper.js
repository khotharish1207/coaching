var nodemailer = require('nodemailer'),
    mailConfig = require('../config/config'),
    Promise = require('bluebird'),
    StringConstants = require('./string-constants');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport([
    'smtps://',
    mailConfig.mailServer.user_id,
    ':',
    mailConfig.mailServer.password,
    '@smtp.gmail.com'
].join(''));

module.exports = {
    sendConfirmationMail: function(email, confirmationLink) {
        var tmpl = [
                '<h1> Hey, </h1>',
                '<p> To confirm your registration click on below link.</p>',
                '<a href=',
                confirmationLink,
                '> Click Here.',
                '</a>'
            ].join(''),
            mailOptions = {
                from: mailConfig.mailServer.user_id, // sender address
                to: email, // list of receivers
                subject: StringConstants.mailSubjects_confirmationMail, // Subject line
                html: tmpl // html body
            };

        // send mail with defined transport object
        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(' --- error --- ', error);
                    return reject(error);
                } else {
                    console.log(' --- info --- ', info.response);
                    return resolve(info.response);
                }
            });
        });
    },

    sendPasswordResetMail: function (email, passwordResetLink) {
        var tmpl = [
                '<h1> Hey, </h1>',
                '<p> To reset your password click on below link.</p>',
                '<a href=',
                passwordResetLink,
                '> Click Here.',
                '</a>'
            ].join(''),
            mailOptions = {
                from: mailConfig.mailServer.user_id, // sender address
                to: email, // list of receivers
                subject: StringConstants.mailSubjects_passwordResetMail, // Subject line
                html: tmpl // html body
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
    }
};
