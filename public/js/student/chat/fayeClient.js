define('fayeClient', ['store'], function (store) {
	var fayeClient = new Faye.Client(location.origin.replace(/:\d+$/, '') + ':8001/faye');

	fayeClient.addExtension({
		outgoing: function (event, cb) {
			event.ext = event.ext || {};
			event.ext.token = store.user.token;
			cb(event);
		}
	});

	return fayeClient;
});