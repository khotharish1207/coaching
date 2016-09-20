
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Error log schema
 */
var LoggerSchema = new Schema({
    entry_date: {
        type: Date,
        default: Date.now()
    },
    details: {},
    activity: {
        type: String,
        default: ''
    }
}, { timestamps: true });

var Logger = module.exports = mongoose.model('Logger', LoggerSchema);
