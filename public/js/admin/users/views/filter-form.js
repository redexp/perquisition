define('views/filter-form', [
	'views/form',
	'views/paginator',
	'views/autocompleter'
], function (
	Form,
	Paginator,
	Autocompleter
) {

	function FilterForm(params) {
		Form.apply(this, arguments);

		this.paginator = new Paginator({
			node: params.paginator,
			data: {
				limit: this.get('limit')
			}
		});

		var form = this;

		this.teamAutocompleter = new Autocompleter({
			node: this.find('[data-team_name_autocompleter]'),
			input: this.find('[data-team]'),
			hidden: this.find('[name="team_id"]'),
			titleProp: 'name',
			hiddenProp: 'id',
			getList: function (data) {
				return form.callbacks.getTeamsList(data);
			}
		});

		this.listenOn(this.paginator, 'set/page', function (page) {
			this.set('offset', (page - 1) * this.get('limit'));
		});

		this.listenOn(this.paginator, 'page', function () {
			this.save();
		});
	}

	Form.extend({
		constructor: FilterForm,

		ui: {
			team: '[data-team]'
		},

		data: function () {
			return {
				roles: [],
				offset: 0,
				limit: 10
			};
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
			},

			'[name="roles[]"]': {
				prop: {
					'checked': function () {
						return function (node) {
							return this.data.roles.indexOf(node.val()) > -1;
						};
					}
				}
			}
		}
	});

	return FilterForm;
});