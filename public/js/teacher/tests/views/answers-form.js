define('views/answers-form', [
	'views/modal-form',
	'view',
	'moment'
], function (
	Form,
	View,
	moment
) {

	function AnswersForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			this.model('users').reset(params.users);
		});
	}

	Form.extend({
		constructor: AnswersForm,

		data: function () {
			return {
				users: []
			};
		},

		template: {
			'[data-users]': {
				each: {
					prop: 'users',
					view: User
				}
			}
		}
	});

	function User() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: User,

		template: {
			'[data-time]': {
				text: function () {
					return moment.utc(this.data.time).local().format('D MMM HH:mm');
				}
			},

			'[data-photo]': {
				attr: {
					'src': function () {
						return '/student/photo/' + this.data.photo;
					}
				}
			},

			'[data-name]': {
				text: '=name'
			}
		}
	});

	return AnswersForm;
});