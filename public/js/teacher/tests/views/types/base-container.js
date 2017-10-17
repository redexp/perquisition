define('views/types/base-container', [
	'composer',
	'views/types/base',
	'views/menu-item'
], function (
	Composer,
	Base,
	MenuItem
) {

	function BaseContainer() {
		Base.apply(this, arguments);
	}

	Base.extend(Composer.ContainerComponent.prototype).extend({
		constructor: BaseContainer,

		ui: {
			components: '[data-questions]'
		},

		data: function () {
			return {
				componentsProp: ['question', 'questions'],
				componentDataProp: 'question',
				types: this.composer.data.types
			};
		},

		template: {
			'> [data-content] > [data-content-toolbar] [data-questions-types]': {
				each: {
					prop: 'types',
					view: MenuItem,
					dataProp: 'type'
				}
			}
		}
	});

	return BaseContainer;
});