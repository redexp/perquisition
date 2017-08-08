define('utils', [], function () {

	return {
		extend: extend,
		rest: rest
	};

	function extend(target, source) {
		for (var prop in source) {
			if (!source.hasOwnProperty(prop)) continue;

			target[prop] = source[prop];
		}

		return target;
	}

	function rest(arr, n) {
		if (typeof n === 'undefined') {
			n = 1;
		}

		return Array.prototype.slice.call(arr, n);
	}
});