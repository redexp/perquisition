var User = require('./models/user');
var Team = require('./models/team');
var Course = require('./models/course');
var Question = require('./models/question');

User.belongsToMany(Team, {through: 'user_team', as: 'teams'});
Team.belongsToMany(User, {through: 'user_team', as: 'users'});

Course.hasMany(Question);