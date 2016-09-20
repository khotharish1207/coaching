
var Hgn = require('hogan.js'),

    mailConstant  = require('./mail-constants');

module.exports = {
    formMailBody: function(mailBody, data) {
        var body = mailConstant[mailBody];

        return Hgn.compile(body).render(data);
    }
};
