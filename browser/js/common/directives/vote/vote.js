app.directive('vote', function (Socket) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/vote/vote.html',
		link: function(scope,elem,attrs) {

			// console.log('user in directive ', scope.user)
			// console.log('scope.child', scope.child)
			// console.log('element ', elem)
			console.log('socket ', Socket)

			console.log('scope.votes', scope.votes[scope.child._id])

			scope.up = false;
			scope.down = false;
			// console.log(scope.child.upvotes);
			// console.log(scope.user._id);


			if (scope.child.upvotes && (scope.child.upvotes.indexOf(scope.user._id) !== -1)) {
				// console.log('user upvoted this ', scope.child)
				scope.up = true;
			}

			if (scope.child.downvotes && (scope.child.downvotes.indexOf(scope.user._id) !== -1)) {
				// console.log('user downvoted this ', scope.child)
				scope.down = true;
			}

			scope.vote = function (direction) {
				if (direction === 'up') {
					if (scope.up === true) {
						scope.votes[scope.child._id] -= 1;
						scope.up = false;
						Socket.emit('vote', {id: scope.child._id, change: -1})
						return;
					}
					if (scope.down === true) {
						scope.votes[scope.child._id] += 2;
						scope.down = false;
						scope.up = true;
						Socket.emit('vote', {id: scope.child._id, change: 2})
						return;
					}
					Socket.emit('vote', {id: scope.child._id, change: 1})
					scope.votes[scope.child._id] += 1;
					scope.up = true;

				}
				if (direction === 'down') {
					// console.log('downvote')
					if (scope.down === true) {
						scope.votes[scope.child._id] += 1;
						scope.down = false;
						Socket.emit('vote', {id: scope.child._id, change: 1})
						return;
					}
					if (scope.up === true) {
						scope.votes[scope.child._id] -= 2;
						scope.up = false;
						scope.down = true;
						Socket.emit('vote', {id: scope.child._id, change: -2})
						return;
					}
					Socket.emit('vote', {id: scope.child._id, change: -1})
					scope.votes[scope.child._id] -= 1;
					scope.down = true;
				}
			}

			// scope.total = scope.child.upvotes.length - scope.child.downvotes.length

			// if (scope.total.toString().length === 1) scope.total = "\u00A0" + scope.total
			
			// console.log('scope ', scope)
			// console.log('upvotes ', scope.child.upvotes.length)
			// console.log('downvotes ', scope.child.downvotes.length)
		}
	}
})