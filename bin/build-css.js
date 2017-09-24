var less = require('less');
var fs = require('fs');
var p = require('path');
var glob = require('glob');
var config = require('app/config');
var watcherOff = process.argv.indexOf('--watcher=off') > -1;

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	prefixPlugin = new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

var LessPluginCleanCSS = require('less-plugin-clean-css'),
	cleanCSSPlugin = new LessPluginCleanCSS();

var cwd = process.cwd();

Promise
	.all(glob
		.sync(process.argv[2], {cwd: cwd, root: cwd})
		.map(convert)
	)
	.then(function (files) {
		if (watcherOff) return exit();

		sendFiles(files.map(function (file) {
			return file.replace(/.*(\/css\/.*)/, '$1');
		})).then(exit, exit);
		setTimeout(exit, 2000);
	})
	.catch(function (err) {
		console.error(err);
	})
;

function convert(lessPath) {
    return new Promise(function (done, fail) {
		var lessDir = p.dirname(lessPath),
			cssPath = lessPath.replace(/\.less$/, '.css'),
			cssDir = p.dirname(cssPath);

		less.render(
			fs.readFileSync(lessPath).toString(),
			{
				paths: [cwd + '/' + lessDir],
				plugins: [prefixPlugin, cleanCSSPlugin]
			},
			function (err, out) {
				if (err) {
					fail(err);
					return;
				}


				fs.writeFile(cssPath, out.css, function (err) {
				    if (err) fail(err);
					else done(cssPath);
				});
			}
		);
    });
}

function initClient() {
	var Client = require('ws');

	var client = new Client(`ws://localhost:8100`);

	return new Promise(function (done, fail) {
		client.on('open', function () {
			done(client);
		});

		client.on('error', fail);
	});
}

function sendFiles(files) {
	return initClient().then(function (client) {
		return Promise.all(files.map(function (path) {
			return new Promise(function (done, fail) {
				client.send(path, function (err) {
					if (err) fail(err);
					else done();
				});
			});
		}));
	});
}

function exit() {
    process.exit();
}