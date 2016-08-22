/************************************************************************
    
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

************************************************************************/

var Discord = require("discord.js");
var openWeather = require('openweather');
var Zorabot = new Discord.Client();

Zorabot.on('message', function(message) {
	if(message.author != "Zorabot") {
		if (responseObject[message.content.toLowerCase()]) {
			message.reply(responseObject[message.content.toLowerCase()]);
		}
		else if(message.content.startsWith(".w")) {
			message.reply(elTiempo(message.content));
		}
	}
});

Zorabot.loginWithToken("MjE3MDM1MTUzMjc5NTQ5NDQw.CpuxWg.p1V5rE7pvpeNFJ3A_FUcY6csgvw", logIn);


/***********  BIBLIOTECA DE RESPUESTAS ************/ 

var responseObject = {
	"o/"	: "o/",
	"nas"	: "nas",
	"hola"	: "¿qué tal?"
};

/**************************************************/

/***********  BIBLIOTECA DE FUNCIONES  ***********/

function logIn(error, token) {
	if (error) {
		console.log('Error al loguear: ' + error);
	}
	else {
		console.log('Login correcto. \n\nToken: ' + token);
	}
  return;
}

function elTiempo(mensaje) {
	var loc = mensaje.substring(3);
	var out = null;
	
	if(loc == "") {
		out = "Por favor, indica una localización válida >_< (Ejemplo:  .w Madrid)"
	}
	else {
		openWeather.getWeather(city, function(result) {
			console.log(result);
		},  [8efba9c322cd0ff864d0ad9708f4fb65]); // ERROR CON EL PUTO TOKEN :<
		
		{
			"city": loc
		}
		
		out = "el tiempo de hoy para " + loc + " es..." + " ¡despejado!";
	}
	
	return out;
}

/**************************************************/