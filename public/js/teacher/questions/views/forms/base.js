define('views/forms/base', [
	'views/modal-form',
	'utils'
], function (
	ModalForm,
	utils
) {

	function Base() {
		ModalForm.apply(this, arguments);

		this.on('open', function (params) {
			this.setTitle(params.question.title);
		});
	}

	ModalForm.extend({
		constructor: Base,

		ui: {
			title: '[data-title]'
		},

		updateTitle: function () {
			var title = '';

			var nodes = this.ui.title.prop('childNodes');
			for (var i = 0, len = nodes.length; i < len; i++) {
				var node = nodes[i];

				title += node.textContent.replace(/\n/g, '');

				if (node.nodeType === 1) {
					title += "\n";
				}
			}

			this.model('question').set('title', title.trim());
		},

		setTitle: function (title) {
			this.ui.title.html('<p>' + title.replace(/</g, '&lt;').split("\n").join('</p><p>') + '</p>');
		},

		template: {
			'@title': {
				on: {
					'keyup': utils.debounce(300, function () {
						this.updateTitle();
					})
				}
			}
		}
	});

	return Base;
});