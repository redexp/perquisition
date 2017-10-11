define('compose', [], function () {

	return function compose(list) {
		var hash, item, child = {}, i, len;

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

		return list.filter(function (item) {
			return !child[item.id];
		});
	};
});