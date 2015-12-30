app.directive('vote', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/vote/vote.html',
		link: function(scope,elem,attrs) {
			
			scope.total = scope.child.upvotes.length - scope.child.downvotes.length
			if (scope.total.toString().length === 1) scope.total = "\u00A0" + scope.total
			
			console.log('scope ', scope)
			console.log('upvotes ', scope.child.upvotes.length)
			console.log('downvotes ', scope.child.downvotes.length)
		}
	}
})