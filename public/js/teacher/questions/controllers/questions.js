define('controllers/questions', [
	'views/questions-list',
	'views/questions-forms',
	'serverData',
	'compose',
	'jquery'
], function (
	QuestionsList,
	QuestionsForms,
	serverData,
	compose,
	$
) {

	var questions = new QuestionsList({
		node: '#questions-list',
		data: {
			questions: compose(serverData('questions'))
		}
	});

	var forms = new QuestionsForms({
		node: '#questions-forms'
	});

	questions.callbacks.addQuestion = function (type, parent) {
		parent.model(parent.data.componentsProp).add(type.data());
	};

	questions.callbacks.editQuestion = function (question) {
		var form = forms.get(question.data.question.type);

		form.open({
			question: question.data.question,
			save: function (data) {
				question.model('question').assign(data);
			}
		});
	};

	questions.callbacks.cloneQuestion = function (question) {
		var parent = question.parent;
		parent.model(parent.data.componentsProp).add($.extend(true, {}, question.data.question));
	};

	questions.callbacks.deleteQuestion = function (question) {
		var parent = question.parent;
		parent.model(parent.data.componentsProp).remove(question.data.question);
	};

});