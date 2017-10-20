define('dateFormat', [], function () {
	
	return {
		hh_mm_ss: hh_mm_ss,
		mm_ss: mm_ss
	};

	function dd_hh_mm(num) {
		if (!num && num !== 0) return '';

		var d, h, m;
		d = Math.floor(num / 86400);
		h = Math.floor(num % 86400 / 3600);
		m = Math.floor(num % 86400 % 3600 / 60);
		return sprintf('%d:%02d:%02d', d, h, m);
	}

	function hh_mm(num) {
		if (!num && num !== 0) return '';

		var h, m;
		h = Math.floor(num / 3600);
		m = Math.floor((num % 3600) / 60);
		return sprintf('%02d:%02d', h, m);
	}

	function hh_mm_ss(num) {
		if (!num && num !== 0) return '';

		var h, m, s;
		h = Math.floor(num / 3600);
		m = Math.floor((num % 3600) / 60);
		s = num % 60;
		return sprintf('%02d:%02d:%02d', h, m, s);
	}

	function mm_ss(num) {
		if (!num && num !== 0) return '';

		var m, s;
		m = Math.floor(num / 60);
		s = num % 60;
		return sprintf('%02d:%02d', m, s);
	}
	
	function sprintf(format) {
		var args = arguments;
		var i = 1;
		
		return format.replace(/(%02d|%d)/g, function (x, d) {
			var val = String(args[i++]);
			if (d === '%02d' && val.length < 2) {
				val = '0' + val;
			}
			return val;
		});
	}
});