var Team = require('app/db/models/team');

Team.search = function (params) {
	var where = {};

	if (params.name) {
		where.name = {
			$iLike: '%' + params.name + '%'
		};
	}

	if (params.role) {
		where.role = String(params.role);
	}

	if (params.exclude && params.exclude.length > 0) {
		where.id = {
			$notIn: params.exclude
		};
	}

	var method = params.hasOwnProperty('offset') || params.hasOwnProperty('limit') ? 'findAndCount' : 'findAll';

	return Team[method]({
		where: where,
		offset: params.offset,
		limit: params.limit,
		order: [['name', 'ASC']]
	});
};

module.exports = Team;