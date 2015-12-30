app.factory('PMFactory', function ($http) {
	
	function getAllPMS() {
		return $http.get('/api/pms').then(function (response) {
			console.log('Inside factory function ', response.data);
			return response.data;
		});
	}

	function getSentPMS() {
		return $http.get('/api/pms/sent').then(function (response) {
			return response.data;
		});
	}

	function getRecPMS() {
		return $http.get('/api/pms/rec').then(function (response) {
			return response.data;
		});
	}


	function postNewPM(pm) {
		return $http.post('/api/pms/', pm).then(function (response) {
			return response.data;
		});
	}

	return {
		getAllPMS: getAllPMS,
		getSentPMS: getSentPMS,
		getRecPMS: getRecPMS,
		postNewPM: postNewPM
	};
});