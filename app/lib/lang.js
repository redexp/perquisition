var app = require('app');
var locals = require('app/locals');
var sprintf = require('app/lib/sprintf');

module.exports = lang;

function lang(lang, key) {
	if (app.IS_DEV) {
		locals = require('app/locals');
	}

	var args = arguments[2] instanceof Array ? arguments[2] : Array.prototype.slice.call(arguments, 2);

	var str = locals[key] && locals[key][lang] ? locals[key][lang] : key;

	return args.length > 0 ? sprintf(str, args) : str;
}