define('views/types/row', [
	'views/types/base-container',
	'jquery'
], function (
	Container,
	$
) {

	function Row() {
		Container.apply(this, arguments);
	}

	Row.id = 'row';
	Row.data = function () {
		return {
			type: Row.id,
			data: {
				questions: []
			}
		};
	};

	Container.extend({
		constructor: Row,

		node: Container.detachHTML(Row.id),

		data: {
			componentsDirection: 'horizontal'
		}
	});

	return Row;
});