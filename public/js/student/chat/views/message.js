define('views/message', [
	'view',
	'moment',
	'markdown'
], function (
	View,
	moment,
	markdown
) {

	function Message() {
		View.apply(this, arguments);

		var html = markdown(this.data.message.text)
			.replace(/<(\/?)(srcipt|iframe|link)/g, '&lt;$1$2')
			.replace(/\b(on\w+)=(['"]*)/g, '$1&#61;$2')
		;

		this.find('[data-text]').html(html);
	}

	View.extend({
		constructor: Message,

		template: {
			'@root': {
				toggleClass: {
					'same-user': {
						'@index': function (index) {
							var prev = index > 0 && this.parent.data.messages[index - 1];

							return prev && prev.user_id === this.data.message.user_id;
						}
					},
					'same-time': {
						'@index': function (index) {
							var prev = index > 0 && this.parent.data.messages[index - 1];
							var message = this.data.message;

							return (
								prev &&
								prev.user_id === message.user_id &&
								prev.time.slice(11, 16) === message.time.slice(11, 16)
							);
						}
					}
				}
			},

			'[data-user-name]': {
				text: '=message.user_name'
			},
			'[data-time]': {
				text: function () {
					var date = moment.utc(this.data.message.time).local();

					return date.format(isToday(date) ? 'HH:mm' : 'D MMM HH:ss');
				}
			}
		}
	});

	var today = moment().startOf('day');

	function isToday(date) {
		return today < date;
	}

	return Message;
});