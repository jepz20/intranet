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
                var indiceComparativo, factor, indiceRepetido;
                for (var a = 0; a < arreglo.length; a++) {
                    var comparativoFiltro = filtro.nombre;
                    var comparativoPrograma = arreglo[a].nombre;
                    var valorMatch = 0;
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
                        //si ya estaba la letra la busco desde la ultima ubicacion
                         if (comparativoFiltro[i] in resultado) {
                            //busco la ultima posicion que quedo guardada
                            indiceRepetido = resultado[comparativoFiltro[i]][resultado[comparativoFiltro[i]].length-1][0];

                            //busco la siguiente posicion de la letra
                            indiceComparativo = comparativoPrograma.indexOf(comparativoFiltro[i], indiceRepetido + 1) ;

                            //como ya existe como arreglo hago un push con los nuevos datos
                            resultado[comparativoFiltro[i]].push([indiceComparativo,i]);

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
                            break;
                        }
                        factor = 1 - ((Math.abs(indiceComparativo - i ) ) / comparativoPrograma.length );
                        valorMatch = valorMatch + factor;
                    }

                    if (valorMatch !== 0) {
                        console.log(arreglo[a].nombre + ':' + Math.round(valorMatch*100)/100);
                        console.log(resultado);
                        itemAInsertar = arreglo[a];
                        itemAInsertar.valorMatch = valorMatch;
                        arregloFinal.push(itemAInsertar);
                    }

                }
                console.log(arregloFinal);
                arregloFinal = arregloFinal.sort(compara);
                return arregloFinal;
            } else {
                return arreglo;
            }
        } else {
            return arreglo;
        }
    };
}]);
