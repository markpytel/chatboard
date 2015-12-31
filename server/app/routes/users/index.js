'use strict';
var router = require('express').Router();
var _ = require('lodash');
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

// If you want to make sure a user is authenticated before querying for comments
// router.get('/comments', ensureAuthenticated, function (req, res) {

// router.get('/', function (req, res, next) {
// 	console.log('Inside route')
// 	Comment.find().then(function(comments){
// 		console.log('Inside query')
// 		res.status(200).json(comments);
// 	}).then(null, next)

// });

router.get('/', ensureAuthenticated, function (req, res, next) {
	// console.log('Inside route')
	PM.find().populate('author').exec()
	.then(function(pms){
		console.log('Inside query')
		res.status(200).json(pms);
	}).then(null, next)

});

router.get('/usernames', ensureAuthenticated, function (req, res, next) {

	User.find().populate('author').exec()
	.then(function(users){
		var usernames = []
		users.forEach(function(user){
			usernames.push(user.username)
		})
		res.status(200).json(usernames);
	}).then(null, next)
});
