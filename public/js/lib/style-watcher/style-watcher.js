;(function ($) {

	var v = 1;

	var client = new WebSocket('ws://' + location.hostname + ':8100');

	client.onmessage = function (e) {
		var path = e.data;

		var style = $('link[href^="' + path + '"]');

		if (style.length === 0) return;

		var clone = style.last().clone();

		clone.attr('src', path + '?v=' + v++).appendTo('head');

		setTimeout(function () {
			style.remove();
		}, 500);
	};

	client.onopen = function () {
		setInterval(function () {
			client.send('ping');
		}, 10);
	};

})(jQuery);