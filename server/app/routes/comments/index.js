'use strict';
var router = require('express').Router();
var _ = require('lodash');
module.exports = router;
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

var ensureAuthenticated = function(req, res, next) {
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

router.get('/', ensureAuthenticated, function(req, res, next) {
    console.log('Inside route')
    Comment.find().populate('author').exec()
        .then(function(comments) {
            console.log('Inside query')
            res.status(200).json(comments);
        }).then(null, next)

});

router.get('/nested', function(req, res, next) {
    Comment.find({
        parent: {
            $ne: null
        }
    }).then(function(comments) {
        res.status(200).json(comments);
    }).then(null, next)
});

router.get('/root', function(req, res, next) {
    Comment.find({
        parent: null
    }).then(function(comments) {
        res.status(200).json(comments);
    }).then(null, next)
})

router.post('/', ensureAuthenticated, function(req, res, next) {
    console.log('Body inside ', req.body)
    Comment.create(req.body).then(function(comment) {
        res.status(200).json(comment);
    }).then(null, next)
})


router.put('/:id', ensureAuthenticated, function(req, res, next) {

    function removeVote(direction, comment) {
        if (direction === "up") comment.upvotes.splice(comment.upvotes.indexOf(req.user._id), 1)
        if (direction === "down") comment.downvotes.splice(comment.downvotes.indexOf(req.user._id), 1)
        return comment;
    }

    function addVote(direction, comment) {
        if (direction === "up") comment.upvotes.push(req.user._id)
        if (direction === "down") comment.downvotes.push(req.user._id)
        return comment;
    }

    Comment.findOne({_id:req.params.id}).then(function(comment){
        if (req.body.voteconfig.rem) {
            removeVote(req.body.voteconfig.rem, comment)
        }
        if (req.body.voteconfig.add) {
            addVote(req.body.voteconfig.add, comment)
        }

        return comment.save()
    }).then(function (savedDoc) {
        res.status(200).json(savedDoc)
    });


})