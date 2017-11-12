define('controllers/license', [
	'ajax',
	'jquery'
], function (
	ajax,
	$
) {

	$('#main').one('mousedown', function () {
		ajax('/student/license-key/used');
	});
});