var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnect from server');
});

//custom event listner
socket.on('newMessage', function (message) {
	//console.log('New Message',message);
	var li = $('<li></li>');
	li.text(`${message.from}: ${message.text}`)

	$("#message").append(li);
});

// socket.emit('createMessage', {
// 	from:'kk',
// 	text:'test'
// }, function (data) {
// 	console.log('Got it', data);
// });

$("#message-form").on('submit', function(e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function () {

	});
});