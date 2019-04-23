//funcion principal
$(function(){
  animarTitulo();
  $('.btn-reinicio').click(function () {
    if ($(this).text() === 'Reiniciar') {
      location.reload(true);
    }
    llenarTablero();
    $(this).text('Reiniciar');
    inicio();
    setTimeout(finJuego,120000);
  });
})
function animarTitulo(){
  $('.main-titulo')
  .animate({
  			opacity: '1',
  		}, {
  			step: function () {
  				$(this).css('color', 'white');
  			},
  			queue: true
  		})
  		.animate({
  			opacity: '1'
  		}, {
  			step: function () {
  				$(this).css('color', 'yellow');
  			},
  			queue: true
  		}, 600)
  		.delay(1000)
  		.animate({
  			opacity: '1'
  		}, {
  			step: function () {
  				$(this).css('color', 'white');
  			},
  			queue: true
  		})
  		.animate({
  			opacity: '1'
  		}, {
  			step: function () {
  				$(this).css('color', 'yellow');
  				animarTitulo();
  			},
  			queue: true
  		});
}

function generarDulces(columna,i,longitud){
  var imagen=Math.floor(Math.random()*4+1);
  if (i==0 && longitud<1) {
      columna.append('<img src="image/'+imagen+'.png" class="elemento"></img>');
  } else {
    columna.find('img:eq(0)').before('<img src="image/' +imagen+ '.png" class="elemento"></img>');
  }
}

function llenarTablero(){
  var columnas = $('.panel-tablero').children();
  var top=7;
  columnas.each(function(){
    var logColumna= $(this).children().length;
    var falta= top-logColumna;
    for (var i = 0; i < falta; i++) {
      generarDulces($(this),i,logColumna);
    }
  })
  movimientoDulces();
  revisarTablero();
}

//arreglo de colunmnas
function arregloColumnas(){
  var arreglo =[];
    for (var i = 1; i < 8; i++) {
      arreglo[i-1]= $('.col-'+i).children();
    }
  return arreglo;
}

// etiqueta elementos mayores a 3 en las colunmnas o filas segun sea (grupoArreglo)
function etiquetarEltos(arregloTriD,grupoArreglo){
  for (var i = 0; i < arregloTriD.length; i++) {
    var arregloBiD = arregloTriD[i];
    for (var j = 0; j < arregloBiD.length; j++) {
      var elementos = arregloBiD[j];
      if (elementos.length>=3) {
        etiquetaElto(i,elementos,grupoArreglo);
      }
    }
  }
}

function etiquetaElto(pos,aIndex, grupoArreglo){
    pos+=1;
    if (grupoArreglo=='columnas') {
      var eltosColumna=$('.col-'+pos).children();
      for (var i = 0; i < aIndex.length; i++) {
    		eltosColumna.eq(aIndex[i]).addClass('delete');
    	}
    } else if(grupoArreglo=='filas'){
      var eltosFila=$("img:nth-child("+pos+")");
      for (var i = 0; i < aIndex.length; i++) {
    		eltosFila.eq(aIndex[i]).addClass('delete');
    	}
    }
}

function verificarTablero(resultado){
  if (resultado) {
    llenarTablero();
  }
}

// eliminar elemento con animacion
function eliminarEltoAnimacion(){
  desactivarEvento();
  $('img.delete').effect('pulsate', 400);
	$('img.delete').animate({
			opacity: '0'
		}, {
			duration: 400
		})
		.animate({
			opacity: '0'
		}, {
			duration: 500,
			complete: function () {
				borrarEltos()
          .then(verificarTablero)
					/*.catch(showPromiseError);*/
			},
			queue: true
		});
}

function borrarEltos() {
	return new Promise(function (responder, rechazar) {
		if ($('img.delete').remove()) {
			responder(true);
		} else {
			rechazar('No se pudo eliminar Candy...');
		}
	})
}

//arreglo de Filas
function arregloFilas(){
      var arreglo =[];
      for (var j = 1; j < 8; j++) {
          arreglo[j-1]=$("img:nth-child("+j+")");
      }
  return arreglo;
}

function buscar(arregloFoC){
  var arregloDeArreglo = arregloFoC;
  var arregloIndices=[];
    for (var i = 0; i < 7; i++) {
      var indices=[];
      var index2=0;
      var auxIndices=[];
      var arreglo=arregloDeArreglo[i];
      var elementoArreglo= arreglo.eq(0).attr('src');
      for (var j = 1; j < 7; j++) {
        var sgteEltoArreglo=arreglo.eq(j).attr('src')
        auxIndices.push(j-1);
        if (elementoArreglo!=sgteEltoArreglo) {
          indices[index2]=auxIndices;
          auxIndices=[];
          if (indices[index2].length>=3) {
            puntuacion(indices[index2].length)
          }
          index2+=1;
        }
          if (j==6){
            auxIndices.push(j);
            indices[index2]=auxIndices;
            if (indices[index2].length>=3) {
              puntuacion(indices[index2].length)
            }
          }
        elementoArreglo=sgteEltoArreglo;
      }
      arregloIndices[i]=indices;
    }
    return arregloIndices;
}

function revisarTablero(){
  var arrayColumnas=buscar(arregloColumnas());
  var arrayFilas=buscar(arregloFilas());
  etiquetarEltos(arrayColumnas,'columnas');// etiqueta los elementos a eliminar de las columnas
  etiquetarEltos(arrayFilas,'filas');  //etiqueta los elementos a eliminar de las filas
  if ($('img.delete').length !== 0) {
  eliminarEltoAnimacion(); // borrar los etiquetados con la clase delete
}
}

function puntuacion(nroEltos){
  var puntos = Number($('#score-text').text());
  puntos+= nroEltos;
  $('#score-text').text(puntos);
}

function finJuego() {
	$('div.panel-tablero, div.time').effect('fold');
	$('h1.main-titulo').addClass('title-over')
		.text('Gracias por jugar!');
	$('div.score, div.moves, div.panel-score').width('100%');

}

//mover las imagenes de dulces con drag and drop
function movimientoDulces() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
		grid: [100, 100],
		zIndex: 10,
		drag: constrainCandyMovement
	});
	$('img').droppable({
		drop: swapCandy
	});
	habilitarEvento();
}

function desactivarEvento() {
	$('img').draggable('disable');
	$('img').droppable('disable');
}

function habilitarEvento() {
	$('img').draggable('enable');
	$('img').droppable('enable');
}

//hace que el caramelo sea solido al moverse
function constrainCandyMovement(event, candyDrag) {
	candyDrag.position.top = Math.min(100, candyDrag.position.top);
	candyDrag.position.bottom = Math.min(100, candyDrag.position.bottom);
	candyDrag.position.left = Math.min(100, candyDrag.position.left);
	candyDrag.position.right = Math.min(100, candyDrag.position.right);
}

//reemplaza a los caramelos anteriores
function swapCandy(event, candyDrag) {
	var candyDrag = $(candyDrag.draggable);
	var dragSrc = candyDrag.attr('src');
	var candyDrop = $(this);
	var dropSrc = candyDrop.attr('src');
	candyDrag.attr('src', dropSrc);
	candyDrop.attr('src', dragSrc);

	setTimeout(function () {
		llenarTablero();
		if ($('img.delete').length === 0) {
			candyDrag.attr('src', dragSrc);
			candyDrop.attr('src', dropSrc);
		} else {
			actualizarMovidas();
		}
	}, 500);

}

function actualizarMovidas() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}
