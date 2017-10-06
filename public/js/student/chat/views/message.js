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