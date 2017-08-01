var crypt = require('bcrypt');
var User = require('app/db/models/user');

module.exports = {
	login: function (username, password) {
		return User
			.findOne({
				where: {
					username: username
				}
			})
			.then(function (user) {
				if (!user) throw new Error('User not found');

				if (!crypt.compareSync(password, user.get('password'))) throw new Error('Wrong user password');

				return user;
			})
		;
	},

	getById: function (id) {
		return User.findById(id);
	},
};