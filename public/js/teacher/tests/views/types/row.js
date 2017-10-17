define('views/types/row', [
	'views/types/base-container',
	'detachHTML',
	'lang'
], function (
	BaseContainer,
	detachHTML,
	__
) {

	function Row() {
		BaseContainer.apply(this, arguments);
	}

	Row.id = 'row';
	Row.data = function () {
		return {
			type: Row.id,
			questions: []
		};
	};
	Row.title = __('question.row');

	BaseContainer.extend({
		constructor: Row,

		node: detachHTML(Row.id),

		data: {
			componentsDirection: 'horizontal'
		}
	});

	return Row;
});