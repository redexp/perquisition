define('views/types/row', [
	'views/types/base-container',
	'detachHTML'
], function (
	BaseContainer,
	detachHTML
) {

	function Row() {
		BaseContainer.apply(this, arguments);
	}

	Row.id = 'row';

	BaseContainer.extend({
		constructor: Row,

		node: detachHTML(Row.id)
	});

	return Row;
});