var socket = io();

function scrollToBottom(){
	//Selector
	var messages = $("#messages");
	var newMessages = messages.children('li:last-child');

	//Height
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessages.innerHeight();
	var lastMessagesHeight = newMessages.prev().innerHeight();
	
	if(clientHeight + scrollTop + newMessageHeight + lastMessagesHeight >= scrollHeight){
		messages.scrollTop(scrollHeight);
	}	
}

socket.on('connect', function () {
	//console.log('Connected to server');
	var params = $.deparam(window.location.search);
	socket.emit('join', params, function (err) {
		if (err){
			alert(err);
			window.location.href = '/';
		}else{
			console.log('No error.');
		}
	});
});

socket.on('disconnect', function () {
	console.log('Disconnect from server');
});

socket.on('updateUserList', function (users) {
	var ol = $('<ol></ol>');

	users.forEach(function (user) {
		ol.append($('<li></li>').text(user));
	});
	$('#users').html(ol);
	//console.log('User list', users);

});

//custom event listner
socket.on('newMessage', function (message) {
	//console.log('New Message',message);
	var formattedTime = moment(message.createdAt).format('h:mm:ss a');
	var template = $('#message-template').html();
	var html = Mustache.render(template,{
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$("#messages").append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm:ss a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template,{
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	$("#messages").append(html);
	scrollToBottom();
});

// socket.emit('createMessage', {
// 	from:'kk',
// 	text:'test'
// }, function (data) {
// 	console.log('Got it', data);
// });

$("#message-form").on('submit', function(e) {
	e.preventDefault();

	var messageTextbox = $('[name=message]');
	socket.emit('createMessage', {
		from: 'User',
	    text: messageTextbox.val()
	}, function () {
	    messageTextbox.val('');
	});

});

var locationButton = $('#send-location');
locationButton.on('click', function () {
	if(!navigator.geolocation) {
		return alert('Geolocation is not supported by tour browser');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');
	navigator.geolocation.getCurrentPosition( function (position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location.')
	});

});