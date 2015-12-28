// app.directive('mooFocusExpression', function($timeout) {
//     return {
//         restrict: 'A',
//         link: {
//             post: function postLink(scope, element, attrs) {
//                 scope.$watch(attrs.mooFocusExpression, function(value) {

//                     if (attrs.mooFocusExpression) {
//                         if (scope.$eval(attrs.mooFocusExpression)) {
//                             $timeout(function() {
//                                 element[0].focus();
//                             }, 100); //need some delay to work with ng-disabled
//                         }
//                     }
//                 });
//             }
//         }
//     };
// });

// app.directive('focus', function($timeout, $parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             console.log('element within directive ', element)
//             scope.$watch(attrs.focus, function(newValue, oldValue) {
//                 if (newValue) {
//                     console.log('trying to focus')
//                     console.log('element', element)
//                     element[0].focus();
//                 }
//             });
//             element.bind("blur", function(e) {
//                 $timeout(function() {
//                     scope.$apply(attrs.focus + "=false");
//                 }, 0);
//             });
//             element.bind("focus", function(e) {
//                 $timeout(function() {
//                     scope.$apply(attrs.focus + "=true");
//                 }, 0);
//             })
//         }
//     }
// });

app.directive('focusOnShow', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            // console.log('attr' ,$attr)
            // console.log('elem' ,$element.children())
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    // console.log('$scope ',$scope)
                    if(newValue){
                        $timeout(function(){
                            // console.log('attempt to focus', $element[0])
                            $element[0].children[1].children[0].children[0].focus();
                        }, 0);
                    }
                })      
            }
            // if ($attr.ngHide){
            //     $scope.$watch($attr.ngHide, function(newValue){
            //         if(!newValue){
            //             $timeout(function(){
            //                 $element[0].focus();
            //             }, 0);
            //         }
            //     })      
            // }

        }
    };
})


// app.directive('myFocus', function($timeout) {
//     return {
//         restrict: 'A',
//         link: function($scope, $element, $attr) {
//             $scope.$watch($attr.myFocus, function(newValue){
//                 if(newValue) {
//                     console.log('a new child was picked' ,$scope.child)
//                     $timeout(function() {
//                         $element[0].focus();
//                     }, 0)
//                 }
//             })

//         }
//     }
// })
