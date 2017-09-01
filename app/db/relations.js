var User = require('./models/user');
var Course = require('./models/course');
var Team = require('./models/team');

Course.belongsTo(User);

User.belongsToMany(Team, {through: 'user_team', as: 'teams'});
Team.belongsToMany(User, {through: 'user_team', as: 'users'});