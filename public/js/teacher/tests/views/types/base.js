define('views/types/base', [
	'composer'
], function (
	Composer
) {

	function base() {
		Composer.Component.apply(this, arguments);
	}

	Composer.Component.extend({
		constructor: base,

		editQuestion: function () {
			this.composer.callbacks.editQuestion(this);
		},

		template: {
			'[data-edit]': {
				click: '!editQuestion'
			}
		}
	});

	return base;
});