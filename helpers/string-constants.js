
// This file contains String constats.
module.exports = {
    LOGOUT_SUCCESS: 'You have successfully logged out.',
    LOGIN_SUCCESS: 'You have successfully logged in.',
    USER_ADDED_SUCCESSFULLY: 'User created successfully.',
    USER_ACTIVATED: 'Specified user is activated.',
    USER_DEACTIVATED: 'Specified user is deactivated.',
    PASSWORD_UPDATED: 'Password successfully updated.',
    PASSWORD_RESET_MAIL_SENT: 'Password reset mail has been sent.',

    // Activity constants
    ACTIVATION_ACTIVITY: 'User activation',
    DEACTIVATION_ACTIVITY: 'User deactivation',
    PASSWORD_CHANGE_ACTIVITY: 'User password change',
    ACCOUNT_CONFIRMATION_ACTIVITY: 'User account confirmation',
    FORGOT_PASSWORD_ACTIVITY: 'Forgot password',
    PASSWORD_RESET_ACTIVITY: 'User password reset',

    TOKEN_EXPIRATION_TIME: 60 * 60 * 24,
    VALID_EMAIL_REGEX: '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'
};
