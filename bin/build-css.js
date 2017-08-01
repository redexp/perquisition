var less = require('less');
var fs = require('fs');
var p = require('path');
var glob = require('glob');
var config = require('app/config');
var fayeDisabled = process.argv.indexOf('--faye=disabled') > -1;

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
		exit();
		// if (fayeDisabled) return exit();
		//
		// sendFiles(files.map(function (file) {
		// 	return file.replace(/.*(\/css\/dist\/.*)/, '$1');
		// })).then(exit, exit);
		// setTimeout(exit, 2000);
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

function initFayeClient() {
	var Client = require('faye').Client;

	var client = new Client(`http://localhost:${config.portFaye}/faye`);

	client.on('transport:down', function () {
		console.error('Faye down');
	});

	client.on('transport:up', function () {
		console.log('Faye up');
	});

	client.addExtension({
		outgoing: function (message, cb) {
			message.ext = message.ext || {};
			message.ext.dev = true;
			cb(message);
		}
	});

	return client;
}

function sendFiles(files) {
	return initFayeClient().publish('/css/update', {files: files});
}

function exit() {
    process.exit();
}