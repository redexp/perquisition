define('views/types/section', [
	'views/types/base-container',
	'detachHTML',
	'lang'
], function (
	BaseContainer,
	detachHTML,
	__
) {

	function Section() {
		BaseContainer.apply(this, arguments);
	}

	Section.id = 'section';
	Section.data = function () {
		return {
			type: Section.id,
			questions: []
		};
	};
	Section.title = __('question.section');

	BaseContainer.extend({
		constructor: Section,

		node: detachHTML(Section.id)
	});

	return Section;
});