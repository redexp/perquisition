define('controllers/list', [
	'views/perquisitions',
	'store',
	'steps'
], function (
	Perquisitions,
	store,
	steps
) {

	var perquisitions = new Perquisitions({
		node: '#perquisitions',
		data: {
			list: store.perquisitions
		}
	});

	perquisitions.callbacks.startPerquisition = function (perquisition) {
		steps('perquisition', perquisition);
	};
});