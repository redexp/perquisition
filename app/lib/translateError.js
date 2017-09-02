var sq = require('sequelize');
var __ = require('app/lib/lang');

var patterns = [
	{
		key: 'error.unique_column',
		rule: /^(\w+) must be unique$/,
	}
];

module.exports = function (lang, error) {
	if (error instanceof sq.ValidationError) {
		return error.errors
			.map(function (err) {
				return translateValidationError(lang, err);
			})
			.join("\n")
		;
	}
	else {
		return translateError(lang, error);
	}
};

function translateError(lang, error) {
	return __(lang, error.message);
}

function translateValidationError(lang, err) {
	var msg = err.message;

	for (var i = 0, len = patterns.length; i < len; i++) {
		var pattern = patterns[i],
			match = pattern.rule.exec(msg);

		if (match) {
			msg = __(lang, pattern.key, match.slice(1).map(function (key) {
				return __(lang, 'column.' + key);
			}));
			break;
		}
	}

	return msg;
}