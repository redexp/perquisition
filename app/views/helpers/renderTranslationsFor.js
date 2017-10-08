var md5 = require('md5');
var fs = require('fs');
var app = require('app');
var glob = require('glob');

module.exports = function (req, res) {
	/**
	 * @function
	 * @name renderTranslationsFor
	 * @param {string} dir path to directory in public/js
	 * @param {string} id? script id attribute value, default: translations
	 * @global
	 */
	res.locals.renderTranslationsFor = function (dir, id) {
		var hash = md5('translations:' + dir);
		var cachePath = app.PUBLIC_DIR + '/js/cache/' + hash + '.json';

		if (fs.existsSync(cachePath)) {
			return `<script type="application/json" id="${id || 'translations'}-json">${fs.readFileSync(cachePath).toString()}</script>`;
		}

		var path = app.PUBLIC_DIR + '/js/' + dir;

		var files = glob.sync(path + '/**/*.js');

		var keys = {};

		files.forEach(function (file) {
			fs.readFileSync(file).toString().replace(/\b__\(['"]([^'"]+)['"]\)/g, function (x, key) {
				keys[key] = '';
			});
		});

		for (var key in keys) {
			if (!keys.hasOwnProperty(key)) continue;

			keys[key] = res.locals.__(key);
		}

		keys = JSON.stringify(keys);

		fs.writeFileSync(cachePath, keys);

		return `<script type="application/json" id="${id || 'translations'}-json">${keys}</script>`;
	};
};