'use strict';
var router = require('express').Router();
var _ = require('lodash');
module.exports = router;
var mongoose = require('mongoose');
var PM = mongoose.model('PM');
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

router.get('/sent', ensureAuthenticated, function (req, res, next) {
	// Find only pms sent by you or sent to you
	// console.log('user inside route for pms: ', req.user)
	PM.find({author: req.user._id}).populate('pmto').exec()
	.then(function(pms){
		res.status(200).json(pms);
	}).then(null, next)
});

router.get('/rec', ensureAuthenticated, function (req, res, next) {
	// Find only pms sent by you or sent to you
	// console.log('user inside route for pms: ', req.user)
	PM.find({pmto: req.user._id}).populate('author').exec()
	.then(function(pms){
		res.status(200).json(pms);
	}).then(null, next)
});

router.post('/', ensureAuthenticated, function (req, res, next) {
	User.findOne({username: req.body.pmto}).then(function(user) {
		req.body.pmto = user._id;
		req.body.author = req.user._id;
		return PM.create(req.body);
	}).then(function(pm) {
		res.status(200).json(pm);
	}).then(null, next)
});