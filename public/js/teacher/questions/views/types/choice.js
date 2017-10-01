define('views/types/choice', [
	'view',
	'views/types/base'
], function (
	View,
	Base
) {

	function Choice() {
		Base.apply(this, arguments);
	}

	Choice.id = 'choice';
	Choice.data = function () {
		return {
			type: Choice.id,
			data: {
				options: []
			}
		};
	};

	Base.extend({
		constructor: Choice,

		node: Base.detachHTML(Choice.id),

		template: {
			'[data-options]': {
				each: {
					prop: 'question.data.options',
					view: Option,
					dataProp: 'option'
				}
			}
		}
	});

	function Option() {
		View.apply(this, arguments);

		this.listenOn(this.parent, '@question.data.multiple', function (multiple) {
			this.set('type', multiple ? 'checkbox' : 'radio');
		});
	}

	View.extend({
		constructor: Option,

		data: {
			type: 'checkbox'
		},

		template: {
			'[data-option-title]': {
				text: '@option.title'
			},
			'[data-option-type]': {
				attr: {
					'type': '@type',
					'name': function () {
						return this.parent.id;
					}
				}
			}
		}
	});

	return Choice;
});