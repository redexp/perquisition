var Team = require('app/db/models/team');
var db = require('app/db');
var s = require('squel');
var omit = require('lodash/omit');

Team.search = function (params) {
	var where = {};

	if (params.name) {
		where.name = {
			$iLike: '%' + params.name + '%'
		};
	}

	if (params.role) {
		if (params.role instanceof Array) {
			where.role = {
				$in: params.role
			};
		}
		else {
			where.role = String(params.role);
		}
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
	}).then(function (res) {
		if (!params.users_count) return res;

		var teams = method === 'findAll' ? res : res.rows;

		return Team.setUsersCount(teams).then(function () {
			return res;
		});
	});
};

Team.setUsersCount = function (teams) {
	if (teams.length === 0) return Promise.resolve(teams);

	return db.execute(s
		.select()
		.field('count(*)', 'count')
		.field('max(team_id)', 'id')
		.from('user_team')
		.where('team_id in ?', teams.map(function (team) {
			return team.id;
		}))
		.group('team_id')
	).then(function (res) {
		var hash = {};
		res[0].forEach(function (item) {
			hash[item.id] = Number(item.count);
		});

		teams.forEach(function (team) {
			team.set('users_count', hash[team.id] || 0, {raw: true});
		});

		return teams;
	});
};

Team.prototype.toJSON = function () {
	return omit(this.get(), ['user_team']);
};

module.exports = Team;