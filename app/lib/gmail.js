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

	return addToQueue(options);
};

var queue = [];

function addToQueue(options) {
	return new Promise(function (done, fail) {
		queue.push({options: options, callback: function (err, res) {
			if (err) {
				fail(err);
			}
			else {
				done(res);
			}
		}});

		sendNext();
	});
}

function removeFromQueue(item) {
	var index = queue.indexOf(item);
	if (index > -1) {
		queue.splice(index, 1);
	}
}

function sendNext() {
	var sending = queue.find(function (item) {
		return !!item.sendind;
	});

	if (sending) return;

	var item = queue.find(function (item) {
		return !item.sendind;
	});

	if (!item) return;

	item.sending = true;

	sender.sendMail(item.options, function (err, res) {
		removeFromQueue(item);

		item.callback(err, res);

		sendNext();
	});
}