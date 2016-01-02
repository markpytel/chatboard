'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    upvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    downvotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
});

mongoose.model('Comment', schema);