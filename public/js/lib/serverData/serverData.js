define('serverData', [], function () {

	return function (id) {
		return JSON.parse(document.getElementById(id + '-json').innerHTML);
	};
});