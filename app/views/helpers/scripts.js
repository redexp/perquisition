var app = require('app');
var pluck = require('lodash/map');
var mapPathsToScripts = require('./lib/mapPathsToScripts');
var md5 = require('md5');
var reader = require('readline');
var fs = require('fs');

module.exports = function (req, res) {
    Object.assign(res.locals, {
		scripts: [],

		/**
		 * @function
		 * @name prependScripts
		 * @param {Array<String>} list
		 * @global
		 */
		prependScripts: function (list) {
			var scripts = res.locals.scripts;

			mapPathsToScripts(list, '/js/').reverse().forEach(function (script) {
				scripts.unshift(script);
			});
		},

		/**
		 * @function
		 * @name appendScripts
		 * @param {Array<String>} list
		 * @global
		 */
		appendScripts: function (list) {
			var scripts = res.locals.scripts;

			mapPathsToScripts(list, '/js/').forEach(function (script) {
				scripts.push(script);
			});
		},

		/**
		 * @function
		 * @name renderScripts
		 * @returns String
		 * @global
		 */
		renderScripts: function () {
			var render = app.IS_DEV ? scriptsToDevHtml : scriptsToProdHtml;

			return render(res.locals.scripts);
		}
	});
};

function scriptsToDevHtml(scripts) {
	var html = '';

	libFirst(scripts, true).forEach(function (script) {
		if (script.defineName) {
			html += `<script>define('${script.defineName}');</script>`;
		}

		html += `<script src="${script.src}"></script>\n`;
	});

	html += `<script>define.end();</script>`;

	return html;
}

function scriptsToProdHtml(scripts) {
	var html = '';

	libFirst(scripts, false).forEach(function (scripts) {
		var hash = md5(JSON.stringify(pluck(scripts, 'src'))),
			path = `${app.PUBLIC_DIR}/js/cache/${hash}.js`;

		html += `<script src="/js/cache/${hash}.js"></script>`;

		if (fs.existsSync(path)) return;

		var lineWriter = fs.createWriteStream(path);

		scripts.forEach(function (script) {
			var path = app.PUBLIC_DIR + script.src;

			if (!fs.existsSync(path)) {
				lineWriter.write(`\nconsole.error('File not found: ${script.src}');\n`);
				return;
			}

			if (script.defineName) {
				lineWriter.write(`\ndefine('${script.defineName}');\n`);
			}

			lineWriter.write(fs.readFileSync(path).toString().replace(/^\s+/gm, '') + "\n;\n");
		});
	});

	return html;
}

function libFirst(scripts, concat) {
	var lib = [],
		rest = [];

	scripts.forEach(function (script) {
		if (script.src.indexOf('/js/lib/') === 0) {
			lib.push(script);
		}
		else {
			rest.push(script);
		}
	});

	return concat ? [].concat(lib, rest) : [lib, rest];
}