/**
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
		socket.broadcast.emit('someoneTyping', true);
	});

	socket.on('typingOver', () => {
		socket.broadcast.emit('noTyping', true);
	})
})

