app.factory('BoardFactory', function ($http) {
	
	function getAllComments() {
		return $http.get('/api/comments').then(function (response) {
			console.log('Inside factory function ', response.data);
			return response.data;
		});
	}

	function getNestedComments() {
		return $http.get('/api/comments/nested').then(function (response) {
			return response.data;
		});
	}

	function getRootComments() {
		return $http.get('/api/comments/root').then(function (response) {
			return response.data;
		});
	}

	function postNewComment(comment) {
		return $http.post('/api/comments/', comment).then(function (response) {
			return response.data;
		});
	}

	// this will eventually have downvotes and upvotes attached too
	function getUsernames() {
		return $http.get('/api/users/usernames').then(function (response) {
			return response.data
		})
	}


	return {
		getAllComments: getAllComments,
		getNestedComments: getNestedComments,
		getRootComments: getRootComments,
		postNewComment: postNewComment,
		getUsernames: getUsernames
	};
});