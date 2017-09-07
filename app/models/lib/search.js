
var search = module.exports = {
	method: function (params) {
		return params.hasOwnProperty('offset') && params.hasOwnProperty('limit') ? 'findAndCount' : 'findAll';
	},

	list: function (params, res) {
		var method = typeof params === 'string' ? params : search.method(params);

		return method === 'findAndCount' ? res.rows : res;
	}
};