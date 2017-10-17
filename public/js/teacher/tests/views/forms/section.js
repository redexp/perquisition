define('views/forms/section', [
	'views/modal-form'
], function (
	Form
) {

	function SectionForm() {
		Form.apply(this, arguments);
	}

	Form.extend({
		constructor: SectionForm,

		node: '#section-form'
	});

	return SectionForm;
});