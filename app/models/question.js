var Question = require('app/db/models/question');

module.exports = Question;

Question.prototype.toJSON = function () {
	return this.get();
};