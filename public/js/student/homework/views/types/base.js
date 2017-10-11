define('views/types/base', [
	'view'
], function (
	View
) {

	function Base() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Base
	});

	return Base;
});