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

const Discord = require("discord.js");
const pack = require('./package.json');

const request = require('request');
const Zorabot = new Discord.Client();

const winston = require('winston');

/*********************************************
Página web de donde se obtiene la información.
Debe tener el plugin WP REST API instalado.
**********************************************/
const WPAPI = require('wpapi');
const apiPromise = WPAPI.discover('http://www.your_web.com');


/***********  BIBLIOTECA DE RESPUESTAS ************/

var responseObject = {
	"o/"	 : "o/",
	"nas"	 : "nas",
	"buenas" : "nas",
	"hola"	 : "¿qué tal?"
};

/**************************************************/

Zorabot.on('message', function(message) {
	if(message.author !== Zorabot.user) {
		if (responseObject[message.content.toLowerCase()]) {
			message.reply(responseObject[message.content.toLowerCase()]);
		}
		else if(message.content.startsWith(".w")) {
			elTiempo(message);
		}
		else if(
		message.content.startsWith(".latiga") || 
		message.content.startsWith(".látigo") || 
		message.content.startsWith(".latigo") || 
		message.content.startsWith(".latigar")) 
		{
			animarFansubbers(message);
		}
		else if(message.content.startsWith(".Zorabot") || message.content.startsWith(".zorabot")) {
			zorabot(message);
		}
	}
});

setInterval(function() {
	autoPublicar();
}, 300000);

/***********  BIBLIOTECA DE FUNCIONES  ***********/

function elTiempo(mensaje) {
	let loc = mensaje.content.substring(3);
	let id = 'YOUR_OPENWEATHERMAP_ID';

	if(loc == "") {
		mensaje.channel.sendMessage('Por favor, ¡indica una localización válida! >_< (Ejemplo:  .w Madrid o .w Madrid,ES)').catch(error => console.log(error.stack));
	}
	else {
		request(
			{
				url: 'http://api.openweathermap.org/data/2.5/weather?q='+loc+'&lang=es&appid='+id,
				json: true
			},
			function (error, response, body) {
				mensaje.channel.sendMessage(':: '+body["name"]+', '+body["sys"]["country"]+' :: '+body['weather'][0]['description']+' :: Temperatura: '+parseFloat(body["main"]["temp"]-273.15).toFixed(2)+'°C :: Presión: '+body["main"]["pressure"]+'mb :: Humedad: '+body["main"]["humidity"]+'%').catch(error => console.log(error.stack));
			}
		);
	}
}

function animarFansubbers(mensaje) {
	let respuesta1 = [
		"¡a tus órdenes!", 
		"¡ahora mismo!", 
		"¡por supuesto!", 
		"¡marchando!", 
		"¡oído cocina!",
		"¡ahí que va!",
		"¡marchando una de látigo!",
		"¡a la orden!"
	];
	let respuesta2 = [
		"¡¡¡CURRAD VAGOS DEL MAL!!! :<", 
		"¿Váis a currar o qué? e__e", 
		"¡¡Currad pedazo de vagos!! :<", 
		"No tenéis remedio... ¡¡CURRAD!! :<", 
		"Me rindo... Pero dejo mi fotito latigando igualmente <3"
	];
	
	mensaje.reply(respuesta1[Math.floor(Math.random() * respuesta1.length)]);
	mensaje.channel.sendFile("YOUR_IMG_PATH/IMG.JPG", "IMG.JPG", respuesta2[Math.floor(Math.random() * respuesta2.length)])
}

function zorabot(mensaje) {
	let respuesta2 = [
		"Esta soy yo, la reina del canal muahahahahahaha :D", 
		"Venga, te voy a enseñar una imagen de mí :)", 
		"¡Esta soy yo! Molo, ¿eh?", 
		"¡Soy el ro-bot más avanzdo del mundo! :D", 
		"Pues sí, he aquí mi figura... ¿A que molo?"
	];
	mensaje.channel.sendFile("YOUR_IMG_PATH/IMG2.JPG", "IMG2.JPG", respuesta2[Math.floor(Math.random() * respuesta2.length)])
}

function autoPublicar() {
	let canal = 'YOUR_CHANNEL'; // Canal destino en el que se publicará.
	let respuesta = [
	"@everyone, ¡tenemos nueva release!",
	"@everyone, ¡marchando release recién salida del horno!",
	"@everyone, ¡moar dronja para vosotros! <3",
	"@everyone, os dejo una cosita por aquí... De nada (?)",
	"@everyone, ¡release fresquita para vuestro body! >__<",
	"@everyone, marchando un episodio de algo que no puedo ver porque soy un bot... ;___;",
	"@everyone, ¡¡¡fire in the hole!!! Os dejo un nuevo episodio por aquí :3",
	"@everyone, me comentan los de arriba que publique esto y yo lo dejo por aquí como buen bot que soy :3",
	"@everyone, los de arriba me explotan con tanto poner releases... (?) /me runs",
	"@everyone, estamos on fire, así que aquí va una release calentita :)"
	];
	
	apiPromise.then(function(site) {
		site.posts().then(function(posts) {
			if(Zorabot.channels.get(canal).messages.last()['content'].indexOf(posts[0]['link']) == -1) {
				Zorabot.channels.get(canal).sendMessage(respuesta[Math.floor(Math.random() * respuesta.length)]);
				Zorabot.channels.get(canal).sendMessage(posts[0]['link']);
			}
		}); 
	});
}

/**************************************************/

/*************** ZONA DE DEBUGUEO ****************/

Zorabot.on('error', e => {
	winston.error(e);
});
Zorabot.on('warn', e => {
	winston.warn(e);
});
Zorabot.on('debug', e => {
	winston.info(e);
});

/**************************************************/

Zorabot.login("DISCORD_TOKEN");