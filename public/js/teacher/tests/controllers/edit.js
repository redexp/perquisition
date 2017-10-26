define('controllers/edit', [
	'views/test-form',
	'views/questions-forms',
	'steps',
	'ajax',
	'promise',
	'uuid',
	'store',
	'clone',
	'notify',
	'lang'
], function (
	TestForm,
	questionsForms,
	steps,
	ajax,
	Promise,
	uuid,
	store,
	clone,
	notify,
	__
) {

	var form = new TestForm({
		node: '#test-form'
	});

	form.callbacks.save = function (data) {
		data.course_id = store.course.id;
		return ajax('/teacher/courses/test', data).then(function (test) {
			notify.success(__('main.saved'));
			steps('tests', {oldTest: form.test, newTest: test});
		});
	};

	form.callbacks.cancel = function () {
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

	form.callbacks.cloneQuestion = function (question) {
		var list = question.parent === question.composer ? question.parent.model('questions') : question.parent.model(['question', 'questions']);
		list.add(clone(question.data.question), list.indexOf(question.data.question) + 1);
	};

	form.callbacks.deleteQuestion = function (question) {
		if (!confirm(__('main.are_you_sure'))) return;

		var list = question.parent === question.composer ? question.parent.model('questions') : question.parent.model(['question', 'questions']);
		list.remove(question.data.question);
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