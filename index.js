/**`
* RealTime Chat App
*
* @author Ugur Cengiz
*/

/** Adding Libraries */
const express = require('express');
const app = express();
const socket = require('socket.io');

/** Setup Node-Backed Static HTTP Server */
app.use(express.static('public'));

/** Specify port and making callback on success */
const server = app.listen(3000, () => console.log('HTTP is Running..'));

const io = socket(server);

/** Nickname colors */

const colors = ['#673ab7', '#4caf50', '#2196f3', '#9c27b0', '#ff5722', '#795548', '#404040'];
var typers = [];

io.on('connection', (socket) => {
	const autocolor = colors[Math.floor(Math.random() * 7)];
	socket.on('nickEntered', function(data){
		socket.nickname = data;
		console.log(socket.nickname + ' katildi');
	});

	socket.on('messageSend', (data) => {
		data['color'] =  autocolor;
		io.sockets.emit('messageGet', data);
	});

	socket.on('typing', () => {	
		typers.push(socket.id);
		console.log(typers.length);
		socket.broadcast.emit('someoneTyping', true);
	});

	socket.on('typingOver', (data) => {
		var elemToRemove = typers.indexOf(data.id);
		if(elemToRemove > -1){
			typers.splice(elemToRemove, 1);
		};

		console.log(typers.length);
		console.log(typers);
		if(typers.length == 0){
			io.sockets.emit('noTyping', true);
		}
	});

	socket.on('disconnect', () => {
		var removal = typers.indexOf(socket.id);
		if(removal > -1){
			typers.splice(removal, 1);
		}

		if(typers.length == 0){
			io.sockets.emit('noTyping', true);
		}
	})

	/** If typers only one left, disable typing animation for only left typer*/
	socket.on('checkTypers', function(client){
		if(typers.length == 1){
			io.to(typers[0]).emit('typingOff');
		}
	});
})