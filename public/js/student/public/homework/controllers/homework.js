define('controllers/homework', [
	'views/homework',
	'serverData'
], function (
	Homework,
	serverData
) {

	new Homework({
		node: '#homework',
		data: {
			homework: serverData('homework')
		}
	});
});