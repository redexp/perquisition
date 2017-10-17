define('views/forms/row', [
	'views/modal-form'
], function (
	Form
) {

	function RowForm() {
		Form.apply(this, arguments);
	}

	Form.extend({
		constructor: RowForm,

		node: '#row-form'
	});

	return RowForm;
});