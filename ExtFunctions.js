/***************  REQUIRES DE NODE  ***************/

const google = require('googleapis');

const customsearch = google.customsearch('v1');

const request = require('request');

const fs = require('fs');

const config = require("./config.json");

const db = require('diskdb');


/***********  BIBLIOTECA DE FUNCIONES  ***********/

module.exports = {

    guardaLog : function(mensaje) {
        let nombreLog = mensaje.channel['guild']['name'].toString().replace(" ", "_")+"_"+mensaje.channel['name'].toString().replace(" ", "_")+".log";
        let msj = "["+mensaje.createdAt.toString().substring(4,24)+"]"+" <"+mensaje.author['username']+"> "+mensaje.content.toString();

        try {
            fs.readFile("./logs/"+nombreLog, 'utf8', function(err, data) {
                if(err) {
                    fs.writeFile("./logs/"+nombreLog, msj, (err) => {
                        if (err) { console.log('Error al guardar el archivo'); }
                    });
                }
                else {
                    fs.writeFile("./logs/"+nombreLog, data+"\n"+msj, (err) => {
                        if (err) { console.log('Error al guardar el archivo'); }
                    });
                }
            });
        }
        catch (err) {
            fs.writeFile("./logs/"+nombreLog, data+"\n"+msj, (err) => {
                if (err) { console.log('Error al guardar el archivo'); }
            });
        }
    },

    enviaLog : function(mensaje) {
        let nombreLog = mensaje.channel['guild'].toString().replace(" ", "_")+"_"+mensaje.channel['name'].toString().replace(" ", "_")+".log";

        try {
            mensaje.author.sendFile("./logs/"+nombreLog, nombreLog, "Aquí tienes el log de completo del canal "+mensaje.channel['name'].toString()+" de "+mensaje.channel['guild'].toString())+":";
        }
        catch (err) {
            mensaje.reply("El log al que estás intentando acceder no existe o está vacío. :slight_frown:")
        }
    },

    elTiempo : function(mensaje) {
        let loc = mensaje.content.substring(3);
        let id = config["OpenWeatherMapId"]; // ID de la API de OpenWeatherMap.

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
    },

    animarFansubbers : function(mensaje) {
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
            "¡¡¡CURRAD VAGOS DEL MAL!!! :rage:",
            "¿Váis a currar o qué? e__e",
            "¡¡Currad, pedazo de vagos!! :angry:",
            "No tenéis remedio... ¡¡CURRAD!! :pensive:",
            "Me rindo... Pero dejo mi fotito latigando igualmente <3"
        ];
        let latigoImg = [
            "latigo0.jpg",
            "latigo1.gif",
            "latigo2.gif",
            "latigo3.gif"
        ];
        let img = latigoImg[Math.floor(Math.random() * latigoImg.length)];

        mensaje.reply(respuesta1[Math.floor(Math.random() * respuesta1.length)]);
        mensaje.channel.sendFile("./img/"+img, img, respuesta2[Math.floor(Math.random() * respuesta2.length)]);
    },

    zorabot : function(mensaje) { // WIP
        let respuesta2 = [
            "Esta soy yo, la reina del canal muahahahahahaha :smiley:",
            "Venga, te voy a enseñar una imagen de mí :smiley:",
            "¡Esta soy yo! Molo, ¿eh?",
            "¡Soy el ro-bot más avanzdo del mundo! :smiley:",
            "Pues sí, he aquí mi figura... ¿A que molo?"
        ];
        mensaje.channel.sendFile("./img/Meika.png", "Meika.png", respuesta2[Math.floor(Math.random() * respuesta2.length)]);
    },

    buscarTermino : function(mensaje) {
        let texto = mensaje.content.substring(3);
        let params = {
            auth		: config["GoogleApiId"], // ID de la API de google
            cx			: config["GoogleSearchEngine"], // Motor de búsqueda customizado de google
            num			: 1,
            q			: texto
        };
        customsearch.cse.list(params, function(err, response) {
            if(err) {
                console.log(err);
            }
            else {
                mensaje.channel.sendMessage(response['items'][0]['title']);
                mensaje.channel.sendMessage(response['items'][0]['link']);
                mensaje.channel.sendMessage(response['items'][0]['snippet']);
            }
        });
    },

    randomNumber : function(mensaje) {
        let rango = mensaje.content.substring(3);
        let numbers = [
            ":zero:",
            ":one:",
            ":two:",
            ":three:",
            ":four:",
            ":five:",
            ":six:",
            ":seven:",
            ":eight:",
            ":nine:"
        ];
        let resultado = "";

        if(isNaN(rango)) {
            mensaje.reply("introduce un número (sin comas, puntos y espacios)... :disappointed: (Ejemplo: .r 3)");
        }
        else if(rango < 2) {
            mensaje.reply("introduce un número mayor a 1 para poder elegir uno ellos... :disappointed: (Ejemplo: .r 3)");
        }
        else {
            let RandNum = (Math.floor(Math.random() * rango) + 1).toString();

            for (let i = 0; i < RandNum.length; i++) {
                resultado += numbers[RandNum[i]];
            }
            mensaje.channel.sendMessage("Número aleatorio:\n\n"+resultado);
        }
    },

    helpExt : function(mensaje) {
        let help =  ":::::::::::::::::::::::::::::::::::::::::::::::: **Comandos disponibles** ::::::::::::::::::::::::::::::::::::::::::::::::\n\n\n"+
            "**.g 'palabra'** --> Búsqueda en google de una palabra o un conjunto.\n\n"+
            "**.w 'ciudad'** --> El tiempo para una ciudad determinada (Ejemplo:  .w Madrid o .w Madrid,ES).\n\n"+
            "**.látigo/latigar/latiga** --> Aplica un severo castigo a los miembros del fansub. :sunglasses:\n\n"+
            "**.zorabot** --> Información técnica sobre el bot.\n\n**.help** --> Descripción de todos los comandos disponibles.\n\n"+
            "**.slap @nombre** --> El slapper de to' la vida del IRC.\n\n"+
            "**.r 'número'** --> Saca un número aleatorio del 1 al número que se le haya especificado.\n\n"+
            "**.log** --> Descarga vía DM el log completo del canal en el que se escribe dicho comando.\n\n"+
            "**.np register 'usuario_de_lasf.fm'** --> Enlaza tu usario de lastf.fm a tu usuario de discord.\n\n"+
            "**.np** --> Muestra la canción que estás reproduciendo actualmente (Solo usuarios registrados con el comando anterior) **Requiere estar sincronizado con last.fm**";
        mensaje.channel.sendMessage(help);
    },

    nowPlaying : function(mensaje, userId) {
        db.connect('./db', ['lastfm']);
        let LastfmUser = db.lastfm.find({userId : userId})[0]['lastFmName'];

        request(
            {
                url: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+LastfmUser+'&api_key='+config["LastFmApiKey"]+'&format=json',
                json: true
            },
            function (error, response, body) {
                let artista = body['recenttracks']['track'][0]['artist']['#text'] || " ";
                let tema = body['recenttracks']['track'][0]['name'] || " ";
                let album = body['recenttracks']['track'][0]['album']['#text'] || " ";
                let cover = body['recenttracks']['track'][0]['image'][2]['#text'] || "./img/no-cover.png";

                mensaje.channel.sendFile(cover, "cover.png", ":headphones: :headphones: ```"+artista+" - "+tema+" (del álbum "+album+")```");
            }
        );
    },

    LastFmValidUser : function(mensaje, userId, LastfmUser) {
        request(
            {
                url: 'http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user='+LastfmUser+'&api_key='+config["LastFmApiKey"]+'&format=json',
                json: true
            },
            function (error, response, body) {
                if(Object.keys(body).length > 2) {
                    mensaje.reply("el usuario que estás intentando registrar no existe en last.fm.");
                }
                else {
                    db.connect('./db', ['lastfm']);

                    if(db.lastfm.find({lastFmName : LastfmUser}).length > 0) {
                        mensaje.reply("Ya hay registrado un usuario con ese nombre... :neutral_face:");
                    }
                    else {
                        let user = {
                            userId      : userId,
                            lastFmName  : LastfmUser
                        };

                        db.lastfm.save([user]);

                        mensaje.channel.sendFile(body['user']['image'][1]['#text'], "avatar.png", "Se ha enlazado correctamente a tu cuenta ("+body['user']["name"]+") de last.fm. :smiley:");
                    }
                }
            }
        );
    }
};