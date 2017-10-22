define('utils', [], function () {

	return {
		extend: extend,
		rest: rest,
		map: map,
		pick: pick,
		debounce: debounce
	};

	function extend(target) {
		for (var i = 1, len = arguments.length; i < len; i++) {
			var source = arguments[i];

			for (var name in source) {
				if (!source.hasOwnProperty(name)) continue;

				target[name] = source[name];
			}
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

	function pick(obj, args) {
		args = args instanceof Array ? args : rest(arguments);

		var data = {}, prop;

		for (var i = 0, len = args.length; i < len; i++) {
			prop = args[i];
			data[prop] = obj[prop];
		}

		return data;
	}

	function debounce(wait, func) {
		var context, args, timestamp, timeout;

		var later = function () {
			var last = Date.now() - timestamp;

			if (last < wait && last >= 0) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				func.apply(context, args);
			}
		};

		return function () {
			context = this;
			args = arguments;
			timestamp = Date.now();
			if (!timeout) timeout = setTimeout(later, wait);
		};
	}
});