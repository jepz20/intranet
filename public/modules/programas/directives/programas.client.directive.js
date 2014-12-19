'use strict';

angular.module('programas')
.directive('ngThumb', function() {
    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            scope.$watch('fileImagen', function(value){

                var onLoadFile = function(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                };

                var onLoadImage = function() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    context =  canvas[0].getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.attr({ width: width, height: height });
                    context.drawImage(this, 0, 0, width, height);
                };

                //scope.formaPaso.$pristine = false;
                var params = scope.$eval(attributes.ngThumb);
                var canvas = element.find('canvas');
                if (value) {
                    var reader = new FileReader();
                    reader.onload = onLoadFile;
                    reader.readAsDataURL(scope.fileImagen);
                } else {
                    canvas.attr({ width: params.width, height: params.height });
                    var context = canvas[0].getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.rect(0, 0, params.width, params.height);
                    context.fillStyle = '#999999';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.font = 'italic 20px sans-serif Helvetica';
                    context.fillText('Icono', params.width/2, params.height/2);
                }
            });
            scope.$watch('programa.icono', function(value) {
                var params = scope.$eval(attributes.ngThumb);
                var canvas = element.find('canvas');
                var img = new Image();
                if (value) {
                    img.src='/modules/programas/img/'+ scope.programa.icono;
                    img.onload = function(){
                        canvas[0].getContext('2d').drawImage(this,0,0);
                    };
                } else {
                    canvas.attr({ width: params.width, height: params.height });
                    var context = canvas[0].getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.rect(0, 0, params.width, params.height);
                    context.fillStyle = '#999999';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.font = 'italic 20px sans-serif Helvetica';
                    context.fillText('Icono', params.width/2, params.height/2);
                }
            });
        }
    };
})
.directive('ngIcono', function() {
    return {
        restrict: 'A',
        template: '<canvas class="img-redonda"></canvas>',
        link: function(scope, element, attributes) {
                var params = scope.$eval(attributes.ngIcono);
                var canvas = element.find('canvas');
                canvas.width = 72;
                canvas.height = 72;
                canvas.attr({ width: 72, height: 72 });
                var context = canvas[0].getContext('2d');
                var icono = new Image();
                if (params.url) {
                    icono.src = '/modules/programas/img/' + params.url;
                    icono.onload = function() {
                        context.drawImage(icono, 0, 0,72,72);
                    };
                } else {
                    var inicial = params.nombre.substr(0,1);
                    var widthPosText, heightPosText, colorFondo,colorTexto;
                    //creo el rectangulo

                    //Segun la letra inicial determino el color de fondo
                    if ('ABCDEJzkxw'.indexOf(inicial) >= 0) {
                        colorFondo = '#F44336';
                        colorTexto = '#FFEBEE';
                    } else if ('FGHIYZvutsr'.indexOf(inicial) >= 0 ) {
                        colorFondo = '#9C27B0';
                        colorTexto = '#FFEBEE';
                    } else if ('KLMNÑcqpomn'.indexOf(inicial) >= 0) {
                        colorFondo = '#3751B5';
                        colorTexto = '#E8EAF6';
                    } else if ('OPQRSmlyjib'.indexOf(inicial) >= 0) {
                        colorFondo = '#009688';
                        colorTexto = '#E0F2F1';
                    } else if ('TUVWXhgfeda'.indexOf(inicial) >= 0) {
                        colorFondo = '#4CAF50';
                        colorTexto = '#E8F5E9';
                    } else {
                        colorFondo = '#F44336';
                        colorTexto = '#FFEBEE';
                    }
                    context.fillStyle = colorFondo;
                    context.fillRect(0, 0, 72, 72 );
                    //segun la letra determino el color de fondo

                    //formo las condiciones del texto
                    context.fillStyle = colorTexto;
                    context.font = 'italic 70px sans-serif Helvetica';
                    context.textAlign = 'center';
                    context.textBaseline='middle';
                    widthPosText = canvas.width/2;
                    heightPosText = canvas.height/2;
                    //Los que tienen una cola abajo los subo un poco mas ya que
                    //estos no se muestan centrados
                    if ('gjpqy'.indexOf(inicial) >= 0) {
                        heightPosText = heightPosText - 13;
                    }
                    context.fillText(inicial, widthPosText, heightPosText);
                }
        }
    };
})
.directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileInput);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
.directive('focusOn', ['$timeout', function($timeout) {
    return {
        scope: '=',
        restrict : 'A',
        link : function($scope,$element,$attr) {
            $scope.$watch($attr.focusOn,function(_focusVal) {
                $timeout(function() {
                    if ( $attr.focusOn === 'listo' ) {
                       $element[0].focus();
                    }
                });
            });

            $attr.$observe('focusOn',function(_focusVal) {
                $timeout(function() {
                    if ( _focusVal === 'listo' ) {
                       $element[0].select();
                    }
                });
            });
        }
    };
}])
.directive('ngDrawer', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function(scope, element, attrs) {
            scope.dialogStyle = {};
            scope.hideModal = function() {
                scope.show = false;
            };
        },
        template: '<div ng-show="show" class="my-show-hide-animation">' +
                    '<div class="ng-drawer-overlay" ng-click="hideModal()"></div>' +
                    '<div class="ng-drawer-dialog" ng-class="{\'splash-open\': animate}">' +
                        '<div class="glyphicon glyphicon-remove ng-drawer-close" ng-click="hideModal()"></div>' +
                        '<div class="ng-drawer-dialog-content" ng-transclude></div>' +
                    '</div>' +
                '</div>'
    };
})
.directive('listaProgramas', function($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'modules/programas/views/list-programas.client.view.html',
        link: function(scope, element,atts) {
            scope.$watch('drawer.shown',function(value) {
            $timeout(function() {
                if ( value ) {
                    scope.filtro = undefined;
                    document.getElementById('filtro').focus();
                }
            },500);
        });
        },
        controller : 'ProgramasController',
    };
});
