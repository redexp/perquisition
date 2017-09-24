define('views/types/section', [
	'views/types/base-container'
], function (
	Container
) {

	function Section() {
		Container.apply(this, arguments);
	}

	Section.id = 'section';
	Section.data = function () {
		return {
			type: Section.id,
			data: {
				questions: []
			}
		};
	};

	Container.extend({
		constructor: Section,

		node: Container.detachHTML(Section.id),

		data: {
			componentsDirection: 'vertical'
		}
	});

	return Section;
});