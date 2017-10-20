var User = require('./models/user');
var Team = require('./models/team');
var Course = require('./models/course');
var Question = require('./models/question');
var Message = require('./models/message');
var Homework = require('./models/homework');
var Test = require('./models/test');
var TestUser = require('./models/test_user');
var Answer = require('./models/answer');

User.belongsToMany(Team, {through: 'user_team', as: 'teams'});
Team.belongsToMany(User, {through: 'user_team', as: 'users'});

Course.hasMany(Question);
Course.hasMany(Homework);
Course.hasMany(Test);

User.hasMany(Message);
Course.hasMany(Message);

Test.hasMany(Answer);
User.hasMany(Answer);

Test.belongsToMany(User, {through: TestUser});
User.belongsToMany(Test, {through: TestUser});