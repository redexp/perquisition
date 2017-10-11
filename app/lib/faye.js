var Faye = require('faye');
var config = require('app/config');
var server = server = require('https').createServer(config.ssl);
var uuid = require('uuid').v4;

var faye = new Faye.NodeAdapter({mount: '/faye'});

faye.attach(server);
server.listen(8001);

module.exports = faye;

var fayeClient = faye.getClient();

fayeClient.token = uuid();
fayeClient.addExtension({
	outgoing: function (message, cb) {
		message.ext = message.ext || {};
		message.ext.internal = fayeClient.token;
		cb(message);
	}
});

faye.addExtension({
	outgoing: function (message, cb) {
		if (message.ext && message.ext.internal) {
			delete message.ext.internal;
		}

		if (message.ext && message.ext.token) {
			delete message.ext.token;
		}

		cb(message);
	}
});