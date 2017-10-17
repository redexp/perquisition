define('views/questions-forms', [], function () {

	return {
		forms: {},

		open: function (params) {
			var type = params.question.type;
			var form = this.forms[type];

			if (!form) {
				var Form = require('views/forms/' + type);
				form = this.forms[type] = new Form();
			}

			form.open(params);
		}
	};
});