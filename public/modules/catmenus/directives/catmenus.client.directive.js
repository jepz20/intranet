'use strict';

angular.module('programas')
.directive('siguienteFocus', [function() {
    return {
        restrict : 'A',
        link : function($scope,$element,$attr) {
            $element.bind('keydown', function($event) {
                if ($event.keyCode === 13 || $event.keyCode === 9) {
                    document.getElementById($attr.siguienteFocus).focus();
                    $event.preventDefault();
                }
            });
        }
    };
}]);
