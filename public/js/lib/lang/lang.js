define('lang', [
	'serverData',
	'sprintf'
], function (
	serverData,
	sprintf
) {

	var cache = {};

	return function (key) {
		var id = 'translations';

		var translations = cache[id];

		if (!translations) {
			translations = cache[id] = serverData(id);
		}

		key = translations.hasOwnProperty(key) ? translations[key] : key;

		if (arguments.length > 1) {
			key = sprintf(key, Array.prototype.slice.call(arguments, 1));
		}

		return key;
	};
});