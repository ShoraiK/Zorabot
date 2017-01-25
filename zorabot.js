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
const Zorabot = new Discord.Client();
const winston = require('winston');
const funcionExterna = require('./ExtFunctions');
const config = require("./config.json");
const db = require('diskdb');

/*********************************************
 Página web de donde se obtiene la información.
 Debe tener el plugin WP REST API instalado.
 /**********************************************/
const WPAPI = require('wpapi');
const apiPromise = WPAPI.discover(config['Web']);

/* Mensaje genérico que se lanza cuando un usuario no tiene permisos */
const denied = "no tienes permisos para ejecutar este comando... :unamused:";


/***********  BIBLIOTECA DE RESPUESTAS ************/
const responseObject = {
    "nas": "nas",
    "buenas": "nas",
    "hola": "¿qué tal?"
};


/***********  ZORABOT CORE ************/

setInterval(function() {
	autoPublicar();
}, 300000);

Zorabot.on('message', function(message) {
	if(message.author !== Zorabot.user) {
        if (responseObject[message.content.toLowerCase()]) {
            message.reply(responseObject[message.content.toLowerCase()]);
        }
        else if(message.content.startsWith(".")) {
            if(message.content.startsWith(".w ")) {
                funcionExterna.elTiempo(message);
            }
            else if(
                message.content.startsWith(".latiga") ||
                message.content.startsWith(".látigo") ||
                message.content.startsWith(".latigo") ||
                message.content.startsWith(".latigar"))
            {
                if(message.channel.type != "dm") {
                    if(message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Staff") || message.member.roles.find("name", "Jubileta")) {
                        funcionExterna.animarFansubbers(message);
                    }
                    else {
                        message.reply(denied);
                    }
                }
                else {
                    message.reply("Este comando no sirve de nada en un privado... :confused:");
                }
            }
            else if(message.content.startsWith(".Zorabot") || message.content.startsWith(".zorabot")) {
                if(message.channel.type != "dm") {
                    if(message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Staff") || message.member.roles.find("name", "Jubileta")) {
                        funcionExterna.zorabot(message);
                    }
                    else {
                        message.reply(denied);
                    }
                }
                else {
                    message.reply("Este comando no sirve de nada en un privado... :confused:");
                }
            }
            else if(message.content.startsWith(".g ")) {
                funcionExterna.buscarTermino(message);
            }
            else if(message.content.startsWith(".help")) {
                if(!message.content.toString().substr(5)) {
                    funcionExterna.helpExt(message);
                }
            }
            else if(message.content.startsWith(".slap ")) {
                slap(message);
            }
            else if(message.content.startsWith(".r ")) {
                funcionExterna.randomNumber(message);
            }
            else if(message.content.startsWith(".np")) {
                if(message.content.startsWith(".np register ")) {
                    let usuario = message.content.toString().substr(13);

                    if(usuario == "") {
                        message.reply('indica un usuario a registrar... :unamused:');
                    }
                    else {
                        funcionExterna.LastFmValidUser(message, message.author.id, usuario)
                    }
                }
                else if (message.content.toString().substr(3) == "") {
                    db.connect('./db', ['lastfm']);

                    if(db.lastfm.find({userId : message.author.id}).length > 0) {
                        funcionExterna.nowPlaying(message,message.author.id);
                    }
                    else {
                        message.reply("antes de usar este comando, debes estar registrado con un **usuario** **válido** de last.fm (Ejemplo: .np register Shorai91).")
                    }
                }
                else {
                    message.reply('asegúrate de haber escrito correctamente el comando. \n\n*Ejemplo: .np register "Shorai" (Sin las comillas y que exista en last.fm) o .np si ya estás registrado.*\n');
                }
            }
            else if (message.content.startsWith('.fl ')) {
                funcionExterna.searchFLN(message);
            }
        }
	}
});


/***********  FUNCIONES INTERNAS (CORE)  ***********/

function autoPublicar() {
    let canal = '215884342646276097'; // Canal destino en el que se publicará.
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
        "@everyone, estamos on fire, así que aquí va una release calentita :smiley:"
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

function slap(mensaje) {
    let nick1 = mensaje.author;
    let nick2 = "";
    let slap = "";

    if(mensaje.content.substring(6) == "") {
        mensaje.channel.sendMessage("¿Y a quién se supone que tengo que darle? :unamused:")
    }
    else {
        if(Zorabot.users.find("username", mensaje.content.substring(6)) != null) {
            nick2 = Zorabot.users.find("username", mensaje.content.substring(6));
        }
        else {
            nick2 = mensaje.content.substring(6);
        }

        slap = nick1 + " slaps " + nick2 + " around a bit with a large trout.";

        if(mensaje.content.substring(6) == "<@217035153279549440>" || mensaje.content.substring(6).toLowerCase() == "zorabot") {
            slap = "(╯°□°）╯︵ ┻━┻";
        }
        mensaje.channel.sendMessage(slap);
    }
}

/*************** ZONA DE DEBUGUEO ****************/
/*
Zorabot.on('error', e => {
	winston.error(e);
});
Zorabot.on('warn', e => {
	winston.warn(e);
});
Zorabot.on('debug', e => {
	//winston.info(e);
});
*/

Zorabot.login(config["DiscordToken"]);