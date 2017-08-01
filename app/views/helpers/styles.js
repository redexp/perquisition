var mapPathsToScripts = require('./lib/mapPathsToScripts');

module.exports = function (req, res) {
    Object.assign(res.locals, {
		styles: [],

		/**
		 * @function
		 * @name appendStyles
		 * @param {Array<String>} list
		 * @global
		 */
		appendStyles: function (list) {
			var styles = res.locals.styles;

			mapPathsToScripts(list, '/css/').forEach(function (script) {
				styles.push(script);
			});
		},

		/**
		 * @function
		 * @name prependStyles
		 * @param {Array<String>} list
		 * @exports
		 * @global
		 */
		prependStyles: function (list) {
			var styles = res.locals.styles;

			mapPathsToScripts(list, '/css/').reverse().forEach(function (script) {
				styles.unshift(script);
			});
		},

		/**
		 * @function
		 * @name renderStyles
		 * @returns String
		 * @public
		 * @global
		 */
		renderStyles: function () {
			return stylesToHtml(res.locals.styles);
		}
	});
};

function stylesToHtml(styles) {
	var html = '';

	styles.forEach(function (script) {
		html += `<link rel="stylesheet" href="${script.src}"/>\n`;
	});

	return html;
}