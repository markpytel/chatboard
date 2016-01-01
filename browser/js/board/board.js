app.config(function($stateProvider) {

    // Register our *board* state.
    $stateProvider.state('board', {
        url: '/board',
        params: {
            savedReply: null,
            modal: null,
            page: null
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
                return AuthService.getLoggedInUser();
            },
            users: function(BoardFactory) {
                return BoardFactory.getUsernames();
            },
            sentpms: function(PMFactory) {
                return PMFactory.getSentPMS();
            },
            recpms: function(PMFactory) {
                return PMFactory.getRecPMS();
            },
            modal: function($stateParams) {
                if (!$stateParams.modal) return false;
                else return true;
            },
            page: function($stateParams) {
                console.log('stateparams in page resolve ', $stateParams)
                if (!$stateParams.page) return 1;
                else return $stateParams.page;
            }
        },
        data: {
            authenticate: true
        }
    });

});

app.controller('BoardController', function($rootScope, $state, $scope, comments, BoardFactory, Socket, reply, $stateParams, user, users, sentpms, recpms, modal, page) {

    // Scope Variables

    $scope.page = page;
    console.log('page ', $scope.page)
    $scope.arrOfPages = [];
    $scope.votes = {};
    $scope.comments = comments;
    $scope.children = [];
    $scope.children = makeTree();
    $scope.numofitems = $scope.children.length
    makeArrayOfPages();
    $scope.children = $scope.arrOfPages[$scope.page]
    $scope.reply = reply;
    $scope.user = user;
    $scope.users = users;
    $scope.sentpms = sentpms;
    $scope.recpms = recpms;
    $scope.erasenot = null;
    $scope.displayed;
    $scope.replying = $scope.reply.parent;
    $scope.somerep = [];
    $scope.newpost = false;
    $scope.modal = modal;

    $scope.maxSize = 5;
    $scope.bigTotalItems = 140;
    $scope.bigCurrentPage = 1;
    $scope.numPages = 10;

    // Socket Listener Event

    Socket.removeListener('newPost');
    Socket.removeListener('someoneReplying');
    Socket.removeListener('init');
    Socket.removeListener('vote');
    Socket.removeListener('pm');
    Socket.removeListener('sentpm');
    Socket.removeListener('recpm');

    // Event listeners

    if ($scope.modal) {
        console.log('this only happens if you had the window open')
        $rootScope.$emit('newpms', {sentpms: sentpms, recpms: recpms}) 
    }

    window.onbeforeunload = function () {
        if($scope.replying){
            Socket.emit('someoneReplying', {
                childId: $scope.replying,
                username: $scope.user.username,
                unload: 'onbeforeunload'
            })
        }
    }

    $scope.$on('$stateChangeStart', function () {
        if($scope.newpost) return;
        if($scope.replying){
            Socket.emit('someoneReplying', {
                childId: $scope.replying,
                username: $scope.user.username,
                unload: 'statechangestart'
            })
        }
    })

    Socket.on('init', function (event){
        // console.log('CLIENT received init event ', event.somerep)
        $scope.somerep = event.somerep
        $scope.$apply();
    })

    Socket.on('newPost', function() {
        // console.log('CLIENT received newPost event ', $scope.somerep)
        $scope.newpost = true;
        console.log('scope page before transition ', $scope.page)
        $state.transitionTo($state.current, {
            savedReply: $scope.reply,
            page: $scope.page
        }, {
            reload: true,
            inherit: false,
            notify: true
        });
    });

    Socket.on('someoneReplying', function (event) {
        // console.log('CLIENT received a someoneReplying event ', event.somerep)
        $scope.somerep = event.somerep
        $scope.$apply();
    })

    Socket.on('vote', function (event) {
        $scope.votes[event.id] += event.change
        $scope.$apply();

    })

    Socket.on('pm', function (event) {   
        $scope.newpost = true;
        console.log('scope page before transition ', $scope.page)

        $state.transitionTo($state.current, {
            savedReply: $scope.reply,
            modal: $scope.modal,
            page: $scope.page
        }, {
            reload: true,
            inherit: false,
            notify: true
        });
    })

    Socket.emit('init', {user: $scope.user.username})
    // console.log('CLIENT emitted init event somerep on client: ', $scope.somerep)

    // Visibility

    $scope.determine = function(child) {
        return child._id === $scope.displayed;
    };
    $scope.hideshowPost = function(child) {
        if ($scope.displayed === child._id) $scope.displayed = null;
        else $scope.displayed = child._id;
    };
    $scope.detThr = function() {
        return $scope.thread
    }
    $scope.setThr = function() {
        $scope.thread = !$scope.thread
    }
    $scope.detRep = function(child) {
        // console.log('childid truth ', child._id, $scope.replying)
        return child._id === $scope.replying;
    };
    $scope.hideshowReply = function(child) {
        $scope.thread = false;

        if ($scope.replying === child._id) {
            $scope.replying = null;
            $scope.reply = {};
        }
        else {
            $scope.erasenot = $scope.replying;
            $scope.replying = child._id;
            $scope.reply.parent = child._id;
            $scope.reply.author = $scope.user._id;
            $scope.reply.body = null;
        }
    };
    $scope.detSomeRep = function(child) {
        var answer = false;
        $scope.somerep.forEach(function(rep) {
            if (rep.slice(0, 24) === child && rep.slice(24) !== $scope.user.username) answer = true;
        })
        return answer;
    }

    // Generate Comment Tree

    function makeTree() {
        var map = {};
        var start = [];
        var node;
        for (var i = 0; i < comments.length; i++) {
            node = comments[i];
            node.children = [];
            $scope.votes[node._id] = node.upvotes.length - node.downvotes.length;
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

    function makeArrayOfPages() {
        console.log('making pages')
        var length = Math.ceil($scope.children.length/10)
        $scope.arrOfPages.push('[]');
        console.log('length')
        for (var i=1; i<length+1; i++) {
            console.log('i ', i)
            $scope.arrOfPages.push($scope.children.slice((i-1)*10,i*10))
        }

        console.log('arrofpages done ', $scope.arrOfPages)

    }

    $scope.gotoPage = function(index) {
        console.log('going to page ', index)
        $scope.page = index;
        $scope.children=$scope.arrOfPages[index]
    }

    // Reply Functions

    $scope.formReply = function(child) {

        if (child.parent === null) $scope.hideshowPost(child)
        $scope.hideshowReply(child);

        // console.log('CLIENT before emitting someoneReplying event: ', $scope.somerep)
        Socket.emit('someoneReplying', {
            childId: child._id,
            username: $scope.user.username,
            prevcId: $scope.erasenot
        })
    };

    $scope.submitReply = function() {
        if ($scope.reply.parent === 'new') $scope.reply.parent = null;
        var reply = $scope.reply;
        reply.upvotes = [user._id];

        console.log('reply before sent ', $scope.reply)
        BoardFactory.postNewComment(reply).then(function(newReply) {
            // console.log('CLIENT somerep before emit newPost event ', $scope.somerep)
            Socket.emit('someoneReplying', {
                childId: $scope.replying,
                username: $scope.user.username
            })
            Socket.emit('newPost');
            // console.log('CLIENT somerep after emit newPost event ', $scope.somerep)
            // console.log('CLIENT somerep before transition after submit reply ', $scope.somerep)
            $scope.newpost = true;
            $state.transitionTo($state.current, {
                savedReply: {}
            }, {
                reload: true,
                inherit: false,
                notify: true
            });
            // console.log('CLIENT somerep after transition after submit reply ', $scope.somerep)
        });
    };

    // $('.list-group').on('click', function(){
    //     console.log('A post was clicked')
    //     $.notify("I'm over here")
    // });

});