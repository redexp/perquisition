define('views/forms/row', [
	'views/modal-form',
	'views/types/row'
], function (
	Form,
	Row
) {

	RowForm.id = Row.id;

	function RowForm() {
		Form.apply(this, arguments);
	}

	Form.extend({
		constructor: RowForm
	});

	return RowForm;
});