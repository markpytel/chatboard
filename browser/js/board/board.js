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
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser()
            }
        },
        data: {
            authenticate: true
        }
    });

});

app.controller('BoardController', function($state, $scope, comments, BoardFactory, Socket, reply, $stateParams, user) {

    $scope.comments = comments;
    $scope.children = [];
    $scope.children = makeTree();
    $scope.reply = reply;
    $scope.user = user;
    $scope.currep;

    $scope.ernot = null;
    $scope.displayed;
    $scope.replying = $scope.reply.parent;
    $scope.somerep = [];

    Socket.removeListener('newPost');
    Socket.removeListener('someoneReplying');

    console.log($scope.user)

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
        else { 
            $scope.ernot = $scope.replying;
            $scope.replying = child._id;
        }
    }

    $scope.detSomeRep = function (child, work) {
        // console.log('during')
        // // console.log('IMPORTANT',child+""+work)
        // console.log($scope.somerep, child + "" + work)
        // console.log($scope.somerep.indexOf(child+""+work))
        // console.log('inside function ', $scope.somerep.indexOf(child+""+work) !== -1)

        // 567f5f4fa3eb1600292e6307
        // 123456789012345678901234
        var answer = false;
        $scope.somerep.forEach(function(rep){
            if (rep.slice(0,24)===child) answer = true;
        })

        return answer;


        // return $scope.somerep.indexOf(child+""+work) === -1 ? false : true;
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
        // console.log('after state transition')
        // console.log('saved post id ', $scope.reply)
        // if($scope.reply.parent) {
        //     console.log('only if post id above is something')
        //     console.log('before before apply ',$scope.replying)
        //     $scope.replying = $scope.reply.parent
        //     console.log('before apply ', $scope.replying)
        //     $scope.$apply();
        // }
    });

    Socket.on('someoneReplying', function(event) {
        $scope.currep = event.username;
        // console.log('currep in socket ', $scope.currep)
        // console.log('event is: ', event.childId)
        // console.log(event.username, ' is replying to something')
        console.log('magic element ',event.prevcId)
        if (event.prevcId) {
            var cid = $scope.somerep.indexOf(event.prevcId+""+event.username);
            if (cid !== -1) $scope.somerep.splice(cid, 1);
        }
        var eid = $scope.somerep.indexOf(event.childId+""+$scope.currep)
        if (eid !== -1) $scope.somerep.splice(eid, 1);
        else $scope.somerep.push(event.childId+""+$scope.currep)

        // console.log('array of replies ', $scope.somerep)
        // console.log($scope.detSomeRep(event.childId))
        // console.log('before')
        $scope.$apply();
        // console.log('after')
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
        console.log('child local ', child)
        if (child.parent===null) $scope.hideshowPost(child)
        $scope.hideshowReply(child);
        // console.log('Child from reply button ', child);
        // console.log('scopeuser',$scope.user)
        $scope.reply.parent = child._id;
        $scope.reply.author = $scope.user._id;
        Socket.emit('someoneReplying', {childId: child._id, username: $scope.user.username, prevcId: $scope.ernot})
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