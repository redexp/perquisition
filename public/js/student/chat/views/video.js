define('views/video', [
	'view'
], function (
	View
) {

	function Video() {
		View.apply(this, arguments);

		this.node.append(this.data.video.videoNode);
	}

	View.extend({
		constructor: Video,

		stopVideo: function () {
			this.parent.callbacks.stopVideo(this.data.video);
		},

		template: {
			'[data-stop-video]': {
				click: 'stopVideo'
			}
		}
	});

	return Video;
});