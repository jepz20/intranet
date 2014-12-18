'use strict';

angular.module('programas')
.filter('textoNoExacto', [function () {
    return function( arreglo, filtro, val) {
        var arregloFinal = [];

        function compara(a,b) {
            if (b.valorMatch < a.valorMatch)
                return -1;
            if (b.valorMatch > a.valorMatch)
                return 1;
            return 0;
        }

        if (filtro) {
            if (filtro.nombre || filtro.nombre !=='') {
                for (var a = 0; a < arreglo.length; a++) {
                    var indiceComparativo, indiceRepetido;
                    var comparativoFiltro = filtro.nombre;
                    var comparativoPrograma = arreglo[a].nombre;
                    var valorMatch = 0, posicionAnterior = 0, factorPosicion= 0,
                    totalPosicion = 0, totalDistancia = 0, factorDistancia = 0,
                    nuevaPosicion = 0;
                    var itemAInsertar = {};
                    comparativoFiltro = comparativoFiltro.replace('á','a');
                    comparativoFiltro = comparativoFiltro.replace('é','e');
                    comparativoFiltro = comparativoFiltro.replace('í','i');
                    comparativoFiltro = comparativoFiltro.replace('ó','o');
                    comparativoFiltro = comparativoFiltro.replace('ú','u');
                    comparativoFiltro = comparativoFiltro.replace(' ','');
                    comparativoPrograma = comparativoPrograma.replace('á','a');
                    comparativoPrograma = comparativoPrograma.replace('é','e');
                    comparativoPrograma = comparativoPrograma.replace('í','i');
                    comparativoPrograma = comparativoPrograma.replace('ó','o');
                    comparativoPrograma = comparativoPrograma.replace('ú','u');
                    comparativoPrograma = comparativoPrograma.replace(' ','');
                    comparativoPrograma = comparativoPrograma.toUpperCase();
                    comparativoFiltro = comparativoFiltro.toUpperCase();
                    var resultado = {};
                    for (var i = 0; i < comparativoFiltro.length; i++) {
                        nuevaPosicion = -1;
                        //si ya estaba la letra la busco desde la ultima ubicacion
                        if (comparativoFiltro[i] in resultado) {
                            //busco la ultima posicion que quedo guardada
                            indiceRepetido = resultado[comparativoFiltro[i]][resultado[comparativoFiltro[i]].length-1][0];

                            //busco la siguiente posicion de la letra
                            indiceComparativo = comparativoPrograma.indexOf(comparativoFiltro[i], indiceRepetido + 1) ;

                            //como ya existe como arreglo hago un push con los nuevos datos
                            resultado[comparativoFiltro[i]].push([indiceComparativo,i]);

                            // Si la letra es repetida y es mayor que la posicion anterior tomo
                            // esta posicion como la nueva posicion
                            if (indiceRepetido >= posicionAnterior) {
                                nuevaPosicion = indiceRepetido + 1;
                            }
                         } else {
                            //si es primera vez que encuentra la letra
                            //busco desde la posicion 0
                            indiceComparativo = comparativoPrograma.indexOf(comparativoFiltro[i]) ;
                            //creo el array porque es primera vez
                            resultado[comparativoFiltro[i]] = [[indiceComparativo,i]];
                         }

                        //si la letra no existe me salgo
                        if ( indiceComparativo === -1 ) {
                            valorMatch = 0;
                            totalDistancia = 0;
                            totalPosicion = 0;
                            break;
                        }

                        //El factor de posicion determina si la letra esta en la misma posicion de busqueda
                        //como de la palabra
                        factorPosicion = ((Math.abs(indiceComparativo - i ) ) / comparativoPrograma.length );
                        if ( factorPosicion === 0 ) {
                            factorPosicion = 2;
                        }

                        if (nuevaPosicion === -1) {
                            nuevaPosicion = comparativoPrograma.indexOf(comparativoFiltro[i],posicionAnterior);
                        }

                        //El factor de distancia determina si las letras estan continuas en la palabra a buscar
                        // y la separacion entre las mismas
                        //si no es la primera letra hago la comparativa de continuidad
                        if ( i > 0) {
                            factorDistancia = nuevaPosicion - posicionAnterior;
                            posicionAnterior = nuevaPosicion;
                            if (factorDistancia < 1) {
                                factorDistancia = comparativoPrograma.length;
                            }

                            factorDistancia = 1 / factorDistancia;
                            if ( factorDistancia === 1) {
                                factorDistancia = 2;
                            }
                        } else {
                            //si es la primera ves igualar la posicionAnterior a la primera letra
                            posicionAnterior = nuevaPosicion;
                        }

                        totalDistancia = totalDistancia + factorDistancia;
                        totalPosicion = totalPosicion + factorPosicion;
                    }

                    valorMatch = totalDistancia + totalPosicion;
                    if ( comparativoPrograma.length >= comparativoFiltro.length ) {
                        valorMatch = valorMatch / comparativoPrograma.length;
                    }

                    if (valorMatch !== 0) {
                        //console.log(arreglo[a].nombre, valorMatch, totalPosicion,totalDistancia, comparativoPrograma.length);
                        itemAInsertar = arreglo[a];
                        itemAInsertar.valorMatch = valorMatch;
                        arregloFinal.push(itemAInsertar);
                    }

                }
                if (arregloFinal) {
                    if (arregloFinal.length > 0) {
                        arregloFinal = arregloFinal.sort(compara);
                    }
                }
                return arregloFinal;
            } else {
                return arreglo;
            }
        } else {
            return arreglo;
        }
    };
}]);
