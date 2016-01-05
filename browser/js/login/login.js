app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;
    $scope.signup = {};

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('board');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

    $scope.sendSignUp = function (signUpInfo) {
        if (!$scope.signup.username || !$scope.signup.email || !$scope.signup.password) {
            // console.log('something not right')
            return;
        }
        else {
            AuthService.signUp(signUpInfo).then(function () {
                $state.go('board');
            }).catch(function () {
                $scope.error = 'Invalid signup credentials.';
            });
        }
    };

});