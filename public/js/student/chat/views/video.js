define('views/video', [
	'view'
], function (
	View
) {

	function Video() {
		View.apply(this, arguments);

		this.ui.video.append(this.data.video.videoNode);
	}

	View.extend({
		constructor: Video,

		ui: {
			video: '[data-video]'
		},

		stopVideo: function () {
			this.parent.callbacks.stopVideo(this.data.video);
		},

		template: {
			'[data-stop-video]': {
				click: 'stopVideo',
				visible: function () {
					return this.data.video.id === 'camera' || this.data.video.id === 'screen';
				}
			}
		}
	});

	return Video;
});