define('views/forms/section', [
	'views/modal-form',
	'views/types/section'
], function (
	Form,
	Section
) {

	SectionForm.id = Section.id;

	function SectionForm() {
		Form.apply(this, arguments);
	}

	Form.extend({
		constructor: SectionForm
	});

	return SectionForm;
});