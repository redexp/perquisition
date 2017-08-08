var User = require('./models/user');
var Course = require('./models/course');

Course.belongsTo(User);