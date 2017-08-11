define('utils', [], function () {

	return {
		extend: extend,
		rest: rest,
		map: map
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

	function map(obj, cb) {
		if (obj instanceof Array) {
			return obj.map(cb);
		}
		else {
			var arr = [];
			for (var prop in obj) {
				if (!obj.hasOwnProperty(prop)) continue;

				arr.push(cb(obj[prop], prop));
			}
			return arr;
		}
	}
});