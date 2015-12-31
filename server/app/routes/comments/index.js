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

    function removeVote(commentId, userId, direction) {
        return Comment.findOne({_id:commentId}).then(function(comment) {
            if (direction === "up") comment.upvotes.splice(comment.upvotes.indexOf(userId), 1)
            if (direction === "down") comment.downvotes.splice(comment.upvotes.indexOf(userId), 1)
            return comment.save();
        })
    }

    function addVote(commentId, userId, direction) {
        return Comment.findOne({_id:commentId}).then(function(comment) {
            if (direction === "up") comment.upvotes.push(userId)
            if (direction === "down") comment.downvotes.push(userId)
            return comment.save();
        })
    }

    if (req.body.voteconfig.rem) {
        removeVote(req.params.id, req.body.username, req.body.voteconfig.rem).then(function(savedDoc) {
        })
    }
    if (req.body.voteconfig.add) {
        addVote(req.params.id, req.body.username, req.body.voteconfig.add).then(function(savedDoc) {
        })
    }
})