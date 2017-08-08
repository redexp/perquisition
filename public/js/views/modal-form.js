define('views/modal-form', [
	'views/form'
], function (
	Form
) {

	function ModalForm() {
		Form.apply(this, arguments);

		this.on('open', function () {
			this.node.modal('show');
		});

		this.on('cancel close', function () {
			this.node.modal('hide');
		});
	}

	Form.extend({
		constructor: ModalForm,

		ui: {
			form: 'form.modal-body',
			cancel: '[data-cancel]'
		},

		open: function (params) {
			this.callbacks.cancel = params.cancel;

			return Form.prototype.open.call(this, params);
		},

		cancel: function () {
			this.trigger('cancel');
			this.callCallback('cancel');
		},

		template: {
			'@cancel': {
				on: {
					'click': 'cancel'
				}
			}
		}
	});

	return ModalForm;
});