var ErrorCode       = require('../helpers/error-code'),
    ErrorConstant   = require('../helpers/error-constants'),
    StringConstants = require('../helpers/string-constants');

module.exports = {
    /**
     * This function returns an error object for the given set of params as:
     * if user wants to send a response with simple predefined error code-message set
     * only the `error` param is required and it should be one of the error_code.
     * else if user wants to send a custom error response the first param should be falsey.
     * @param error Required
     * @param data Optional
     * @returns {*}
     */
    generateErrorResponse: function(error, data) {
        if (error) {
            return {
                error_code: ErrorCode[error],
                error_message: ErrorConstant[error]
            };
        } else if (!error && data) {
            return { data: data };
        }
    },

    /**
     *
     * @param msg if user have send self configured message.
     * @param data
     * @returns {*}
     */
    generateSuccessResponse: function(msg, data) {
        if (msg) {
            return data ? { message: StringConstants[msg], data: data } :
            { message: StringConstants[msg] }
        } else if (!msg && data) {
            return { data: data };
        }
    },

    /**
     * 
     * @param error
     * @returns {{error_code: *}}
     */
    getErrorCode: function(error) {
        return { error_code: ErrorCode[error] }
    },

    /**
     * 
     * @param error
     * @returns {{error_message: *}}
     */
    getErrorMessage: function(error) {
        return { error_message: ErrorConstant[error] }
    },

    /**
     * 
     * @param msg
     * @returns {{message: *}}
     */
    getSuccessMessage: function(msg) {
        return { message: StringConstants[msg] }
    }
};
