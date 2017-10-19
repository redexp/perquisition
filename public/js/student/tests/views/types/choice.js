define('views/types/choice', [
	'views/types/base',
	'view',
	'detachHTML',
	'markdown'
], function (
	Base,
	View,
	detachHTML,
	markdown
) {

	function Choice() {
		Base.apply(this, arguments);
	}

	Choice.id = 'choice';

	Base.extend({
		constructor: Choice,
		
		node: detachHTML(Choice.id),

		template: {
			'[data-options]': {
				each: {
					prop: 'question.options',
					view: Option,
					dataProp: 'option'
				}
			}
		}
	});

	function Option() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Option,

		template: {
			'[data-text]': {
				html: function () {
					return markdown(this.data.option.text);
				}
			}
		}
	});

	return Choice;
});