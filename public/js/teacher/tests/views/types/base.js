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

		data: {
			collapsed: false
		},

		editQuestion: function () {
			this.composer.callbacks.editQuestion(this);
		},

		cloneQuestion: function () {
			this.composer.callbacks.cloneQuestion(this);
		},

		deleteQuestion: function () {
			this.composer.callbacks.deleteQuestion(this);
		},

		toggleQuestion: function () {
			this.set('collapsed', !this.data.collapsed);
		},

		template: {
			'@root': {
				toggleClass: {
					'collapsed': '@collapsed'
				}
			},

			'[data-edit]': {
				click: '!editQuestion'
			},

			'[data-clone]': {
				click: '!cloneQuestion'
			},

			'[data-delete]': {
				click: '!deleteQuestion'
			},

			'[data-collapse]': {
				click: '!toggleQuestion'
			},

			'[data-expand]': {
				click: '!toggleQuestion'
			}
		}
	});

	return base;
});