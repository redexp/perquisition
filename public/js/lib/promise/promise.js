define('promise', [
	'jquery'
], function (
	$
) {

	if (window.Promise) {
		return window.Promise;
	}

	var Promise = function (callback) {
		var d = $.Deferred();
		this.promise = d.promise();

		callback(d.resolve, d.reject);
	};

	['then', 'catch', 'always'].forEach(function (method) {
		Promise.prototype[method] = function () {
			return this.promise[method].apply(this.promise, arguments);
		};
	});

	Promise.all = function (list) {
		return $.when.apply($, list);
	};

	Promise.resolve = function (value) {
		return $.Deferred().resolve(value).promise();
	};

	Promise.reject = function (value) {
		return $.Deferred().reject(value).promise();
	};

	return Promise;
});