app.directive('vote', function (Socket, BoardFactory) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/vote/vote.html',
		link: function(scope,elem,attrs) {

			scope.up = false;
			scope.down = false;

			if (scope.child.upvotes && (scope.child.upvotes.indexOf(scope.user._id) !== -1)) {
				scope.up = true;
			}

			if (scope.child.downvotes && (scope.child.downvotes.indexOf(scope.user._id) !== -1)) {
				scope.down = true;
			}

			scope.vote = function (direction) {
				if (direction === 'up') {
					if (scope.up === true) {
						scope.votes[scope.child._id] -= 1;
						scope.up = false;
						Socket.emit('vote', {id: scope.child._id, change: -1})

						BoardFactory.vote(scope.child._id, scope.user._id, {rem: 'up'}).then(function(newVote){
							console.log('response from server for vote ', newVote)
						})
						return;
					}
					if (scope.down === true) {
						scope.votes[scope.child._id] += 2;
						scope.down = false;
						scope.up = true;
						Socket.emit('vote', {id: scope.child._id, change: 2})

						BoardFactory.vote(scope.child._id, scope.user._id, {rem: 'down', add: 'up'})
						return;
					}
					Socket.emit('vote', {id: scope.child._id, change: 1})
					scope.votes[scope.child._id] += 1;
					scope.up = true;

					BoardFactory.vote(scope.child._id, scope.user._id, {add: 'up'})

				}
				if (direction === 'down') {
					// console.log('downvote')
					if (scope.down === true) {
						scope.votes[scope.child._id] += 1;
						scope.down = false;
						Socket.emit('vote', {id: scope.child._id, change: 1})

						BoardFactory.vote(scope.child._id, scope.user._id, {rem: 'down'})
						return;
					}
					if (scope.up === true) {
						scope.votes[scope.child._id] -= 2;
						scope.up = false;
						scope.down = true;
						Socket.emit('vote', {id: scope.child._id, change: -2})

						BoardFactory.vote(scope.child._id, scope.user._id, {rem: 'up', add: 'down'})
						return;
					}
					Socket.emit('vote', {id: scope.child._id, change: -1})
					scope.votes[scope.child._id] -= 1;
					scope.down = true;

					BoardFactory.vote(scope.child._id, scope.user._id, {add: 'down'})

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