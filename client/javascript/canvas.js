/*window.onload = function(){

	var canvas = document.getElementById("map"); 
	var ctx = canvas.getContext("2d");
	var updateBox = document.getElementById('updates'); 
	var joinRoomButton = document.getElementById('joinRoom');
	var createRoomButton = document.getElementById('createRoom');
	var room = document.getElementById('room');
	var joinList = document.getElementById('roomList');
	
	room.onclick = function(event){
		console.log(event)
	};

	roomList.onclick  = function(event){
		
	};


	createRoomButton.onclick = function(event){
		console.log(user)
		console.log(rooms)
		socket.emit('createRoom', {

		});
	};

	joinRoomButton.onclick = function(event){
		socket.emit('joinRoom', {
			
		});
	};

	// socket.on('newPositions',function(data){
	// 	ctx.clearRect(0,0,500,500);
	// 	for(var i = 0 ; i < data.player.length; i++)
	// 		ctx.fillText(data.player[i].number,data.player[i].x,data.player[i].y);		
			
	// 	for(var i = 0 ; i < data.bullet.length; i++)
	// 		ctx.fillRect(data.bullet[i].x-5,data.bullet[i].y-5,10,10);		
	// });

	// canvas.onclick = function(event){
	// 	socket.emit('shoot', function(){

	// 	});
	// };

};*/