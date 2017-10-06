module.exports = function (req, res) {
	res.serverData = res.locals.serverData = {};

	/**
	 * @function
	 * @name renderServerData
	 * @param {Object} data
	 * @returns {string}
	 * @global
	 */
	res.locals.renderServerData = function (data) {
		data = data || res.locals.serverData;

		var html = '';

		for (var id in data) {
			if (!data.hasOwnProperty(id)) continue;

			var json = JSON.stringify(data[id]).replace(/</g, '\\u003C');

			html += `<script type="application/json" id="${id}-json">${json}</script>`;
		}

		return html;
	};
};