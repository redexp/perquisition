var student = require('express').Router();

module.exports = student;

student.use('/stream', require('./stream'));