app.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  console.log('scope inside modal controller ', $scope)

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
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

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, pms, sentpms, recpms) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  $scope.pms = pms;
  $scope.sentpms = sentpms;
  $scope.recpms = recpms;

  $scope.view='rec';

  $scope.setView = function (view) {
    console.log('view in setview ', view)
    $scope.view = view;
  }


  console.log('inside modal instance', $scope.sentpms)
  console.log('inside modal instance', $scope.recpms)

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});