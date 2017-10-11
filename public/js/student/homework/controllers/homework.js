define('controllers/homework', [
	'views/questions',
	'serverData',
	'compose'
], function (
	Questions,
	serverData,
	compose
) {

	var questions = new Questions({
		node: '#questions',
		data: {
			questions: compose(serverData('questions'))
		}
	});
});