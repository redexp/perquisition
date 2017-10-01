define('clone', [
	'jquery'
], function (
	$
) {

	return function clone(obj) {
		return $.extend(true, obj instanceof Array ? [] : {}, obj);
	};
});