define('views/filter-form', [
	'views/form',
	'views/paginator'
], function (
	Form,
	Paginator
) {

	function FilterForm(params) {
		Form.apply(this, arguments);

		this.paginator = new Paginator({
			node: params.paginator,
			data: {
				limit: this.get('limit')
			}
		});

		this.listenOn(this.paginator, 'set/page', function (page) {
			this.set('offset', (page - 1) * this.get('limit'));
		});

		this.listenOn(this.paginator, 'page', this.save);
	}

	Form.extend({
		constructor: FilterForm,

		ui: {
			team: '[data-team]'
		},

		data: {
			offset: 0,
			limit: 10
		},

		submit: function () {
			this.paginator.set('page', 1);

			return Form.prototype.submit.call(this);
		},

		template: {
			'[name="offset"]': {
				prop: {
					'value': '@offset'
				}
			},

			'[name="limit"]': {
				prop: {
					'value': '=limit'
				}
			}
		}
	});

	return FilterForm;
});