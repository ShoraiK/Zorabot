/***************  REQUIRES DE NODE  ***************/

const google = require('googleapis');
const customsearch = google.customsearch('v1');
const request = require('request');
const jsdom = require('jsdom');
const fs = require('fs');
const config = require("./config.json");
const db = require('diskdb');
const Discord = require('discord.js');


/***********  BIBLIOTECA DE FUNCIONES  ***********/

module.exports = {

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

    zorabot : function(mensaje, info) { // WIP
        let i = 0;
        let respuesta = [
            "Esta soy yo, la reina del canal muahahahahahaha :smiley:",
            "Venga, te voy a enseñar algo de mí :smiley:",
            "¡Esta soy yo! Molo, ¿eh?",
            "¡Soy el ro-bot más avanzdo del mundo! :smiley:",
            "Pues sí, he aquí mis entrañas... ¿A que molo?"
        ];

        const embed = new Discord.RichEmbed()
            .setTitle('Información general sobre el bot')
            .setDescription(respuesta[Math.floor(Math.random() * respuesta.length)])
            .setColor('BLUE')
            .setThumbnail('http://i.imgur.com/owStj33.png')
            .setURL(require('./package.json').homepage);

        for(i; i < info.length; i++) {
            embed.addField(info[i]["name"], info[i]["value"], true);
        }

        mensaje.channel.sendEmbed(embed).catch(function(err) {
            console.error(err.stack);
        });
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
            "**.np register 'usuario_de_lasf.fm'** --> Enlaza tu usario de lastf.fm a tu usuario de discord.\n\n"+
            "**.np** --> Muestra la canción que estás reproduciendo actualmente (Solo usuarios registrados con el comando anterior) **Requiere estar sincronizado con last.fm**"+
            "**.fl 'palabra'** --> Busca en Frozen Layer información sobre un anime/manga/whatever.\n\n";
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
    },

    searchFLN : function(mensaje) {
        const busqueda = mensaje.content.substr('.fl '.length);

        const url = 'https://www.frozen-layer.com/buscar';

        const form = {
            busqueda,
            utf8: '✓',
        };

        const options = {
            form,
        };

        return request(url, options, function(err, response, html) {
            if (err) {
                return console.error(err.stack);
            }

            const { statusCode } = response;
            if (statusCode >= 400 && statusCode <= 599) {
                const err = new Error(
                    `Frozen Layer respondió con un estado HTTP ${statusCode}`
                );

                return console.error(err.stack);
            }

            return jsdom.env({
                html,
                url,
                done: function(err, window) {
                    if (err) {
                        return console.error(err.stack);
                    }

                    const { document } = window;

                    const results = Array.from(
                        document.querySelectorAll('.titulo a[href*="/animes/"]')
                    ).map(function(el) {
                        const url = el.href;
                        const title = el.textContent.trim();

                        return {
                            title,
                            url,
                        };
                    });

                    if (!results.length) {
                        mensaje.channel.sendMessage('No he encontrado nada... :confused:');
                        return;
                    }

                    const firstResult = results[0];

                    const {
                        title,
                        url,
                    } = firstResult;

                    return request.get(url, function(err, response, body) {
                        if (err) {
                            return console.error(err.stack);
                        }

                        const { statusCode } = response;
                        if (statusCode >= 400 && statusCode <= 599) {
                            const err = new Error(
                                `Frozen Layer respondió con un estado HTTP ${statusCode}`
                            );

                            return console.error(err.stack);
                        }

                        return jsdom.env(body, function(err, window) {
                            if (err) {
                                return console.error(err.stack);
                            }

                            const { document } = window;

                            const description = document.getElementById('sinopsis').textContent.trim();

                            const thumbnail = document.querySelector('img[alt="Portada"]').src;

                            const fields = Array.from(
                                document.querySelectorAll('.an_list li')
                            )
                                .map(function(el) {
                                    return el.textContent.split(':');
                                })
                                .reduce(function(data, pair) {
                                    let [key, value] = pair;
                                    key = key.trim();
                                    value = value.trim() || 'N/A';

                                    value = value.replace(/\n/g, ' ');
                                    value = value.replace(/\( /g, '(');

                                    data[key] = value;

                                    return data;
                                }, {});

                            const embed = new Discord.RichEmbed()
                                .setTitle(title)
                                .setDescription(description)
                                .setThumbnail(thumbnail)
                                .setURL(url);

                            Object.keys(fields).forEach(function(key) {
                                const value = fields[key];
                                let isInline = true;
                                if (key.toLowerCase() === 'genero') {
                                    isInline = false;
                                }
                                embed.addField(key, value, isInline);
                            });

                            mensaje.channel.sendEmbed(embed)
                                .catch(function(err) {
                                    console.error(err.stack);
                                });
                        });
                    });
                }
            });
        });
    },
};
