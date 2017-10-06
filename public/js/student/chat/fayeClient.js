define('fayeClient', [], function () {
	return new Faye.Client(location.origin.replace(/:\d+$/, '') + ':8001/faye');
});