define('controllers/questions', [
	'views/questions-list',
	'views/questions-forms',
	'serverData',
	'jquery'
], function (
	QuestionsList,
	QuestionsForms,
	serverData,
	$
) {

	var questions = new QuestionsList({
		node: '#questions-list',
		data: {
			questions: composeQuestions(serverData('questions'))
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

	function composeQuestions(list) {
		var hash = list.reduce(function (hash, item) {
			hash[item.id] = item;
			return hash;
		}, {});

		var child = {};

		list.forEach(function (item) {
			if (item.data.questions) {
				item.data.questions = item.data.questions.map(function (id) {
					child[id] = true;
					return hash[id];
				});
			}
		});

		return list.filter(function (item) {
			return !child[item.id];
		});
	}
});