require('./config/config.js');
const path 			= require('path');
const http 			= require('http');
const express 		= require('express');
const socketIO 		= require('socket.io');

const {generatemessage} = require('./utils/message');
const publicPath 	= path.join(__dirname,'../public');
const port 			= process.env.PORT;

var app 			= express();
var server 			= http.createServer(app);
var io 				= socketIO(server);


app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	//socket.emit from admin text welcome to the chat app
	socket.emit('newMessage', generatemessage('Admin', 'Welcome to the chat app'));

	//socket.broadcast.emit from admin text new user joined
	socket.broadcast.emit('newMessage', generatemessage("Admin", "New user joined"));

	socket.on('createMessage', (message, callback) => {
		console.log("Create Message:", message);
		io.emit('newMessage', generatemessage(message.from, message.text));
		callback('This is from the server');
	});

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});


server.listen(port, () => {
	console.log(`Server is up on ${port}`);
});