module.exports = function (context, method, args) {
	return args.reduce(function (p, arg) {
		return p.then(function () {
			return context[method](arg);
		});
	}, Promise.resolve());
};