define('views/teams-filter', [
	'views/filter-form'
], function (
	FilterForm
) {

	function TeamsFilter(params) {
		FilterForm.apply(this, arguments);
	}

	FilterForm.extend({
		constructor: TeamsFilter,

		data: function () {
			return {
				name: '',
				role: []
			};
		},

		template: {
			'[name="name"]': {
				prop: {
					'value': '=name'
				}
			},

			'[name="role[]"]': {
				prop: {
					'checked': function () {
						return function (node) {
							return this.data.role.indexOf(node.val()) > -1;
						};
					}
				}
			}
		}
	});

	return TeamsFilter;
});