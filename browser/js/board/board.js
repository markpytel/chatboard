app.config(function($stateProvider) {

    // Register our *board* state.
    $stateProvider.state('board', {
        url: '/board',
        params: {
            savedReply: null
        },
        controller: 'BoardController',
        templateUrl: 'js/board/board.html',
        resolve: {
            comments: function(BoardFactory) {
                return BoardFactory.getAllComments();
            },
            reply: function($stateParams) {
                if (!$stateParams.savedReply) return {};
                else {
                    return $stateParams.savedReply;
                }
            }
        }
    });

});

app.controller('BoardController', function($state, $scope, comments, BoardFactory, Socket, reply, $stateParams) {

    $scope.comments = comments;
    $scope.children = [];
    $scope.children = makeTree();
    $scope.reply = reply;
    
    $scope.displayed;
    $scope.replying;
    $scope.somerep = [];

    Socket.removeListener('newPost');
    Socket.removeListener('someoneReplying');

    $scope.determine = function (child) {
        return child._id === $scope.displayed;
    }

    $scope.hideshowPost = function (child) {
        if ($scope.displayed === child._id) $scope.displayed = null;
        else $scope.displayed = child._id;
    }

    $scope.detRep = function (child) {
        return child._id === $scope.replying;
    }

    $scope.hideshowReply = function (child) {
        if ($scope.replying === child._id) $scope.replying = null;
        else $scope.replying = child._id;
    }

    $scope.detSomeRep = function (child) {
        console.log('inside function ', $scope.somerep.indexOf(child) !== -1)
        return $scope.somerep.indexOf(child) === -1 ? false : true;
    }

    Socket.on('newPost', function() {
        $state.transitionTo($state.current, {
            savedReply: $scope.reply
        }, {
            reload: true,
            inherit: false,
            notify: true
        });
        $.notify("I'm over here", 'info');
    });

    Socket.on('someoneReplying', function(event) {
        console.log('event is: ', event.childId)
        console.log('someone is replying to something')
        $scope.somerep.push(event.childId)
        console.log($scope.detSomeRep(event.childId))
        $scope.$apply();
    })


    function makeTree() {
        var map = {};
        var start = [];
        var node;
        for (var i = 0; i < comments.length; i++) {
            node = comments[i];
            node.children = [];
            map[node._id] = i;
            if (node.parent) {
                comments[map[node.parent]].children.push(node);
            } else {
                node.parent = null;
                start.push(node);
            }
        }
        return start;
    }

    $scope.formReply = function(child) {
        if (child.parent===null) $scope.hideshowPost(child)
        $scope.hideshowReply(child);
        console.log('Child from reply button ', child);
        $scope.reply.parent = child._id;
        Socket.emit('someoneReplying', {childId: child._id})
    };

    $scope.submitReply = function() {
        var reply = $scope.reply;
        console.log('Reply inside submit: Reply ', reply);
        BoardFactory.postNewComment(reply).then(function(newReply) {
            console.log('Inside then from PNC ', newReply);
            Socket.emit('newPost');
            $state.transitionTo($state.current, {
                savedReply: {}
            }, {
                reload: true,
                inherit: false,
                notify: true
            });

        });
    };

    // $('.list-group').on('click', function(){
    //     console.log('A post was clicked')
    //     $.notify("I'm over here")
    // });

});