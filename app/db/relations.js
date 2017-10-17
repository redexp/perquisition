var User = require('./models/user');
var Team = require('./models/team');
var Course = require('./models/course');
var Question = require('./models/question');
var Message = require('./models/message');
var Homework = require('./models/homework');
var Test = require('./models/test');

User.belongsToMany(Team, {through: 'user_team', as: 'teams'});
Team.belongsToMany(User, {through: 'user_team', as: 'users'});

Course.hasMany(Question);
Course.hasMany(Homework);
Course.hasMany(Test);

User.hasMany(Message);
Course.hasMany(Message);