define('views/types/base', [
	'composer',
	'jquery'
], function (
	Composer,
	$
) {

	function Base() {
		Composer.Component.apply(this, arguments);
	}

	Base.detachHTML = function (type) {
		var node = $('[data-question-type="'+ type +'"]');

		if (node.length === 0) {
			throw new Error('Undefined html for question type ' + JSON.stringify(type));
		}

		var html = node.prop('outerHTML');
		node.remove();
		return html;
	};

	Composer.Component.extend({
		constructor: Base,

		data: function () {
			return {
				collapsed: false
			};
		},

		onStartDragging: function (e) {
			var offset = this.ui.dragZone.offset();

			this.model('offset').set({
				top: e.pageY - offset.top,
				left: 10
			});

			Base.__super__.onStartDragging.call(this, e);
		},

		collapse: function () {
			this.set('collapsed', true);
		},

		expand: function () {
			this.set('collapsed', false);
		},

		edit: function () {
			this.composer.callbacks.editQuestion(this);
		},

		clone: function () {
			this.composer.callbacks.cloneQuestion(this);
		},

		delete: function () {
			this.composer.callbacks.deleteQuestion(this);
		},

		template: {
			'@root': {
				toggleClass: {
					'dragging': '@dragging',
					'collapsed': '@collapsed'
				}
			},

			'> [data-toolbar]': {
				template: {
					'[data-collapse]': {
						click: 'collapse',
						hidden: '@collapsed'
					},

					'[data-expand]': {
						click: 'expand',
						visible: '@collapsed'
					},

					'[data-edit]': {
						click: '!edit'
					},

					'[data-clone]': {
						click: '!clone'
					},

					'[data-delete]': {
						click: '!delete'
					}
				}
			}
		}
	});

	return Base;
});