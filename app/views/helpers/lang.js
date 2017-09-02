var lang = require('app/lib/lang');
var LANG;

module.exports = function (req, res) {
	req.lang = LANG = (req.signedCookies || req.cookies).lang || 0;

	res.locals.__ = __;
	res.__ = __;
};

function __(key) {
	var args = Array.prototype.slice.call(arguments, 1);

	return lang(LANG, key, args);
}