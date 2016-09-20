
// This maps error constants with error messages.
module.exports = {
    // User related error codes
    INVALID_API_KEY: 'The provided api key is invalid.',
    INVALID_TOKEN: 'The provided access token is invalid.',
    NO_TOKEN: 'No token is provided.',
    INVALID_USER: 'User not found.',
    INVALID_EMAIL_ADDRESS: 'Invalid email format.',
    REGISTRATION_FIELDS_MISSING: 'Some required fields are missing.',
    LOGIN_FAILED: 'Username or password is not correct.',
    ERROR_IN_USER_ADDITION: 'An error occurred while creating user or email already exist.',
    PASSWORD_DOES_NOT_MATCH: 'Username and password is not correct.',
    CONFIRM_PASSWORD_NOT_SAME: 'Password and confirm password should match.',
    ERROR_IN_UPDATE_PASSWORD: 'An error is occurred while updating password.',
    NO_USERS: 'Database is empty.',
    ERROR_WHILE_MAIL_SENDING: 'An unexpected error occurred while sending an email.',
    TOKEN_EXPIRED: 'Invalid or expired token.',
    PLEASE_TRY_AGAIN: 'Please try again.',
    EMAIL_ALREADY_EXIST: 'Email already exists.',

    FB_TOKEN_EXPIRED: 'Failed to fetch user profile.',
    FB_PROFILE_WITHOUT_EMAIL: 'This account doesn\'t have email address',

    AUTHENTICATION_FAILED: 'Authentication failed',

    // Server related error codes
    NOT_FOUND: 'Page not found.',
    UNKNOWN_ERROR: 'Unknown error.'
};
