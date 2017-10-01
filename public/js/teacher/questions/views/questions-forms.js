define('views/questions-forms', [
	'view',
	'views/forms/row',
	'views/forms/section',
	'views/forms/choice'
], function (
	View,
	Row,
	Section,
	Choice
) {

	function QuestionsForms() {
		View.apply(this, arguments);

		var view = this;
		var data = this.data;
		var types = [Row, Section, Choice];

		types.forEach(function (Type) {
			data[Type.id] = new Type({
				node: view.find('[data-question-form="'+ Type.id +'"]').appendTo('body')
			});
		});
	}

	View.extend({
		constructor: QuestionsForms
	});

	return QuestionsForms;
});