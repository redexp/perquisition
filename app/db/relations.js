var User = require('./models/user');
var Team = require('./models/team');

User.belongsToMany(Team, {through: 'user_team', as: 'teams'});
Team.belongsToMany(User, {through: 'user_team', as: 'users'});