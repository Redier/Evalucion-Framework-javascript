var centesimas = 0;
var segundos = 0;
var minutos =2;
var horas = 0;
var control;
function inicio () {
	//control = setInterval(cronometro,10);
	control =setInterval(downCount,1000)

}
function parar () {
	clearInterval(control);

}
function reinicio () {
	clearInterval(control);
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	Centesimas.innerHTML = ":00";
	Segundos.innerHTML = ":00";
	Minutos.innerHTML = ":00";
	Horas.innerHTML = "00";

}
function cronometro () {
	if (centesimas < 99) {
		centesimas++;
		if (centesimas < 10) { centesimas = "0"+centesimas }
		//Centesimas.innerHTML = ":"+centesimas;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos ++;
		if (segundos < 10) { segundos = "0"+segundos }
		timer.innerHTML = ":"+segundos;
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0) ) {
		minutos++;
		if (minutos < 10) { minutos = "0"+minutos }
		//Minutos.innerHTML = ":"+minutos;
	}
	if (minutos == 59) {
		minutos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
		horas ++;
		if (horas < 10) { horas = "0"+horas }
		//Horas.innerHTML = horas;
	}
}
function downCount(){
	if ( (minutos!=0) || (segundos!=0) ) {
		if (segundos==0) {
				segundos=60;
				minutos-=1;
		}
			segundos-=1;
			if (segundos<10) {
				segundos='0'+segundos;
			}
		 timer.innerHTML='0'+minutos+':'+segundos;
	}else {
		parar();
	}

}
