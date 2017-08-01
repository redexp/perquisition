define('lang', [
	'serverData'
], function (
	serverData
) {

	var cache = {};

	return function (key, id) {
		id = id || 'translations';

		var translations = cache[id];

		if (!translations) {
			translations = cache[id] = serverData(id);
		}

		return translations.hasOwnProperty(key) ? translations[key] : key;
	};
});