define('controllers/edit', [
	'views/test-form',
	'views/questions-forms',
	'steps',
	'ajax',
	'promise',
	'uuid',
	'store'
], function (
	TestForm,
	questionsForms,
	steps,
	ajax,
	Promise,
	uuid,
	store
) {

	var form = new TestForm({
		node: '#test-form'
	});

	form.callbacks.save = function (data) {
		data.course_id = store.course.id;
		return ajax('/teacher/courses/test', data).then(function () {
			steps('tests');
		});
	};

	form.callbacks.close = function () {
		steps('tests');
	};

	form.callbacks.addQuestion = function (type, parent) {
		var list = !parent.composer ? parent.model('questions') : parent.model('question').model('questions');
		var data = type.data();
		data.uuid = uuid();
		list.add(data);
	};

	form.callbacks.editQuestion = function (question) {
		questionsForms.open({
			question: question.data.question,
			save: function (data) {
				question.model('question').assign(data);
			}
		});
	};

	steps.on('test-form', function (test) {
		form.clear();

		var p;

		if (test.id) {
			p = ajax('/teacher/courses/test/questions', {id: test.id});
		}
		else {
			p = Promise.resolve([]);
		}

		p.then(function (questions) {
			form.open({
				test: {
					id: test.id,
					title: test.title,
					questions: questions
				}
			});
		});
	});
});