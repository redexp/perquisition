define('views/types/section', [
	'views/types/base-container',
	'detachHTML'
], function (
	BaseContainer,
	detachHTML
) {

	function Section() {
		BaseContainer.apply(this, arguments);
	}

	Section.id = 'section';

	BaseContainer.extend({
		constructor: Section,

		node: detachHTML(Section.id)
	});

	return Section;
});