define('controllers/edit', [
	'views/test-form',
	'views/questions-forms',
	'views/answers-form',
	'steps',
	'ajax',
	'promise',
	'uuid',
	'store',
	'clone',
	'utils',
	'notify',
	'lang'
], function (
	TestForm,
	questionsForms,
	AnswersForm,
	steps,
	ajax,
	Promise,
	uuid,
	store,
	clone,
	utils,
	notify,
	__
) {

	var form = new TestForm({
		node: '#test-form'
	});

	var answersForm = new AnswersForm({
		node: '#answers-form'
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

	form.callbacks.showUsers = function (answers) {
		var ids = answers.map(function (answer) {
			return answer.user_id;
		});

		ajax('users', {ids: ids}).then(function (users) {
			users = utils.indexBy(users, 'id');

			answersForm.open({users: answers.map(function (answer) {
				var user = clone(users[answer.user_id]);
				user.time = answer.time;
				return user;
			})});
		});
	};

	steps.on('test-form', function (test) {
		form.clear();

		var p;

		if (test.id) {
			p = Promise.all([
				ajax('questions', {id: test.id}),
				ajax('answers', {id: test.id})
			]);
		}
		else {
			p = Promise.resolve([[], []]);
		}

		p.then(function (data) {
			form.open({
				test: {
					id: test.id,
					title: test.title,
					questions: data[0],
					answers: data[1]
				}
			});
		});
	});
});