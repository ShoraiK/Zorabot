const Discord = require("discord.js");const pack = require('./package.json');const request = require('request');const Zorabot = new Discord.Client();const winston = require('winston');var responseObject = {"o/"	 : "o/","nas"	 : "nas","buenas" : "nas","hola"	 : "¿qué tal?"};Zorabot.on('message', function(message) {if(message.author != "Zorabot") {if (responseObject[message.content.toLowerCase()]) {message.reply(responseObject[message.content.toLowerCase()]);}else if(message.content.startsWith(".w")) {elTiempo(message);}else if(message.content.startsWith(".latiga")||message.content.startsWith(".látigo")||message.content.startsWith(".latigo")||message.content.startsWith(".latigar")){animarFansubbers(message);}else if(message.content.startsWith(".Zorabot") || message.content.startsWith(".zorabot")) {zorabot(message);}}});function elTiempo(mensaje) {let loc = mensaje.content.substring(3);if(loc == "") {mensaje.channel.sendMessage('Por favor, ¡indica una localización válida! >_< (Ejemplo:  .w Madrid o .w Madrid,ES)').catch(error => console.log(error.stack));}else {request({url: 'http://api.openweathermap.org/data/2.5/weather?q='+loc+'&lang=es&appid=8efba9c322cd0ff864d0ad9708f4fb65',json: true},function (error, response, body) {mensaje.channel.sendMessage(':: '+body["name"]+', '+body["sys"]["country"]+' :: '+body['weather'][0]['description']+' :: Temperatura: '+parseFloat(body["main"]["temp"]-273.15).toFixed(2)+'°C :: Presión: '+body["main"]["pressure"]+'mb :: Humedad: '+body["main"]["humidity"]+'%').catch(error => console.log(error.stack));});}}function animarFansubbers(mensaje) {let respuesta1 = ["¡a tus órdenes!","¡ahora mismo!","¡por supuesto!","¡marchando!","¡oído cocina!","¡ahí que va!","¡marchando una de látigo!"];let respuesta2 = ["¡¡¡CURRAD VAGOS DEL MAL!!! :<", "¿Váis a currar o qué? e__e", "¡¡Currad pedazo de vagos!! :<", "No tenéis remedio... ¡¡CURRAD!! :<", "Me rindo... Pero dejo mi fotito latigando igualmente <3"];mensaje.reply(respuesta1[Math.floor(Math.random() * respuesta1.length)]+"\n");mensaje.channel.sendFile("/home/segova/Zorabot/img/latigo.jpg", "latigo.jpg", respuesta2[Math.floor(Math.random() * respuesta2.length)])}function zorabot(mensaje) {let respuesta2 = ["Esta soy yo, la reina del canal muahahahahahaha :D", "Venga, te voy a enseñar una imagen de mí :)", "¡Esta soy yo! Molo, ¿eh?", "¡Soy el ro-bot más avanzdo del mundo! :D", "Pues sí, he aquí mi figura... ¿A que molo?"];mensaje.channel.sendFile("/home/segova/Zorabot/img/Meika.png", "Meika.png", respuesta2[Math.floor(Math.random() * respuesta2.length)])}Zorabot.on('error', e => {winston.error(e);});Zorabot.on('warn', e => {winston.warn(e);});Zorabot.on('debug', e => {winston.info(e);});Zorabot.login("DISCORD_TOKEN");