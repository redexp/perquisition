var app = require('app');
var glob = require('glob');

module.exports = mapPathsToScripts;

function mapPathsToScripts(list, prefix) {
	var scripts = [];

	list
		.map(function (path) {
			return pathToScript(path, prefix);
		})
		.forEach(function (script) {
			var res = glob.sync(script.src, {
				cwd: app.PUBLIC_DIR,
				root: app.PUBLIC_DIR
			});

			if (res.length === 0) { // add script any way so we can see 404 error in browser
				scripts.push(script);
				return;
			}

			res.forEach(function (realSrc) {
				scripts.push(Object.assign({}, script, {src: realSrc.replace(app.PUBLIC_DIR, '')}));
			});
		})
	;

	return scripts;
}

function pathToScript(path, prefix) {
	var script = {};

	if (typeof path === 'string') {
		script.src = joinPath(prefix, path);
	}
	else if (typeof path === 'object') {
		script.src = joinPath(prefix, path[0]);

		if (path[1]) {
			script.defineName = path[1];
		}
	}

	return script;
}

function joinPath(prefix, path) {
	return path.charAt(0) === '/' ? path : prefix + path;
}