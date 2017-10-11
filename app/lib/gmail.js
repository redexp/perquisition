var config = require('app/config').gmail;
var mailer = require('nodemailer');

var sender = mailer.createTransport({service: 'Gmail', auth: config});

sender.verify(function (err, res) {
	if (err || !res) {
		console.error('Gmail', err || res);
	}
});

module.exports = function gmail(options) {
	if (options.from) {
		options.from = options.from + ' <' + config.user + '>';
	}

	return new Promise(function (done, fail) {
		sender.sendMail(options, function (err, res) {
			if (err) fail(err);
			else done(res);
		});
	});
};