define('compose', ['clone'], function (clone) {

	function compose(list, ids) {
		var hash, item, child = {}, i, len;

		list = clone(list);

		for (i = 0, len = list.length; i < len; i++) {
			item = list[i];
			hash[item.id] = item;
		}

		for (i = 0, len = list.length; i < len; i++) {
			item = list[i];
			if (item.data.questions) {
				item.data.questions = item.data.questions.map(function (id) {
					child[id] = true;
					return hash[id];
				});
			}
		}

		if (ids) {
			return ids.map(function (id) {
				return hash[id];
			});
		}

		return list.filter(function (item) {
			return !child[item.id];
		});
	}

	function decompose(list, callback) {
		list.forEach(function (question, i) {
			callback(question);
			list[i] = question.uuid;

			if (question.data.questions) {
				decompose(question.data.questions, callback);
			}
		});
	}

	compose.undo = function (list) {
		var questions = [];

		decompose(clone(list), function (question) {
			questions.push(question);
		});

		return questions;
	};

	return compose;
});