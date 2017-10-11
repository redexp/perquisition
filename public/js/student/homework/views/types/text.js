define('views/types/text', [
	'views/types/base'
], function (
	Base
) {

	function Text() {
		Base.apply(this, arguments);
	}

	Base.extend({
		constructor: Text
	});

	return Text;
});