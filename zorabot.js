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
var request = require('request');
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

Zorabot.loginWithToken("your_token", logIn);


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
	var out = "";

	if(loc == "") {
		out = "Por favor, ¡indica una localización válida! >_< (Ejemplo:  .w Madrid o .w Madrid,ES)";
	}
	else {
    request(
      {
        method: 'GET',
        uri: 'http://api.openweathermap.org/data/2.5/weather?q='+loc+'&appid=8efba9c322cd0ff864d0ad9708f4fb65',
        gzip: true
      },
      function (error, response, body) {
        // body is the decompressed response body
				out = JSON.parse(body);
      }
		);
  }
  return out;
}

/**************************************************/
