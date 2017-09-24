define('views/types/base-container', [
	'view',
	'composer',
	'views/types/base',
	'utils'
], function (
	View,
	Composer,
	Base,
	utils
) {

	function BaseContainer() {
		Base.apply(this, arguments);
	}

	BaseContainer.detachHTML = Base.detachHTML;

	Base.extend(Composer.ContainerComponent.prototype).extend({
		constructor: BaseContainer,

		ui: {
			components: '[data-questions]'
		},

		data: function () {
			return {
				componentsProp: ['question', 'data', 'questions'],
				componentDataProp: 'question',
				types: this.composer.data.types
			};
		},

		template: {
			'> .question-content > .add-question [data-questions-types]': {
				each: {
					prop: 'types',
					view: MenuItem,
					dataProp: 'type'
				}
			}
		}
	});

	function MenuItem() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: MenuItem,

		addQuestion: function () {
			this.parent.composer.callbacks.addQuestion(this.data.type, this.parent);
		},

		template: {
			'[data-type-title]': {
				text: '=type.title',

				on: {
					'click': '!addQuestion'
				}
			}
		}
	});

	return BaseContainer;
});