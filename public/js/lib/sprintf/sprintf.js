define('sprintf', [], function () {
	function sprintf(str) {
		var args = arguments,
			i = 1;

		if (args.length > 1 && args[1] instanceof Array) {
			args = args[1];
			i = 0;
		}

		return str.replace(/%(s|d|0\d+d)/g, function (x, type) {
			var value = args[i++];
			switch (type) {
			case 's': return value;
			case 'd': return parseInt(value, 10);
			default:
				value = String(parseInt(value, 10));
				var n = Number(type.slice(1, -1));
				return '0'.repeat(n).slice(value.length) + value;
			}
		});
	}

	return sprintf;
});