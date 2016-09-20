
// This file contains email related constats or dynamic email body. 
module.exports = {
    REGISTRATION_SUBJECT: 'Account Confirmation Link',
    REGISTRATION_BODY: '<p> Hi {{username}}, </p> <br> <span> Please click <a href="{{confirmationLink}}"> here </a> to confirm your account.</span>',
    PASSWORD_RESET_SUBJECT: 'Password Reset Link',
    PASSWORD_RESET_BODY: '<p> Hi {{email}}, </p> <br> <span> Please click <a href="{{resetLink}}"> here </a> to reset your account password.</span>'
};
