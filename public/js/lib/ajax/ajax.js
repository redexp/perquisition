define('ajax', [
	'notify',
	'jquery'
], function (
	notify,
	$
) {

	ajax.baseURL = '';

	return ajax;

	function ajax(url, data, cb) {
		if (typeof data === 'function') {
			cb = data;
			data = {};
		}

		if (ajax.baseURL && url.charAt(0) !== '/') {
			url = ajax.baseURL + url;
		}

		data = data || {};

		if (hasFormData(data)) {
			data = toFormData(data);
		}

		var isFormData = data instanceof window.FormData;

		var p = $.ajax({
			type: 'POST',
			url: url,
			data: isFormData ? data : JSON.stringify(data),
			contentType: isFormData ? false : "application/json; charset=utf-8",
			processData: !isFormData,
			cache: false
		});

		if (cb) {
			p.then(cb);
		}

		p.fail(function (e) {
			showErrorMessage(e, this);
		});

		return p;
	}

	function hasFormData(data) {
		if (data instanceof window.FormData) return false;

		for (var name in data) {
			if (!data.hasOwnProperty(name)) continue;

			if (data[name] instanceof window.File || data[name] instanceof window.Blob) return true;
		}

		return false;
	}

	function toFormData(props) {
		var data = new FormData();
		var values = [];
		var files = [];

		for (var name in props) {
			if (!props.hasOwnProperty(name)) continue;

			if (props[name] instanceof window.File) {
				files.push({name: name, value: props[name]});
			}
			else {
				values.push({name: name, value: props[name]});
			}
		}

		values.forEach(function (item) {
			data.append(item.name, item.value);
		});

		files.forEach(function (item) {
			data.append(item.name, item.value);
		});

		return data;
	}

	function showErrorMessage(e) {
		if (e.responseJSON && e.responseJSON.message) {
			notify.error(e.responseJSON.message);
		}
	}
});