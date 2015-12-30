app.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  console.log('scope inside modal controller ', $scope)

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      draggable: true,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        },
        pms: function () {
          return $scope.$parent.pms
        },
        sentpms: function () {
          return $scope.$parent.sentpms
        },
        recpms: function () {
          return $scope.$parent.recpms
        },
        users: function () {
          return $scope.$parent.users
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, pms, sentpms, recpms, users, PMFactory) {

  $scope.newPM = {};
  $scope.items = items;
  $scope.pms = pms;
  $scope.sentpms = sentpms;
  $scope.recpms = recpms;
  $scope.users = users;
  $scope.selected;
  $scope.view='rec';

  $scope.setView = function (view) {
    console.log('view in setview ', view)
    $scope.view = view;
  }

  $scope.validUser = function () {
    console.log('selected in valid user' ,$scope.selected)
    if ($scope.users.indexOf($scope.newPM.pmto) !== -1) {
      console.log('valid user')
      PMFactory.postNewPM($scope.newPM).then(function(newPM){
        console.log('response from new pm ', newPM)
      })
    }
    else {
      console.log('invalid user');
    }
  }

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});