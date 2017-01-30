var CONSTANTS = require('./constants.js');

module.exports.Player = function(id, x, y){
	return {
		x: x,
		y: y,
		spdX: 0,
		spdY: 0,
		id: id,
		number: "" + Math.floor(10 * Math.random()),
		pressingRight: false,
		pressingLeft: false,
		pressingUp: false,
		pressingDown: false,
		runSpd: 10,
	
	}
}

module.exports.Bullet = function(id, x, y, spdX, spdY){
	return {
		x: x,
		y: y,
		id: id,
		spdX: spdX,
		spdY: spdY
	}
}

module.exports.getDistance = function(body1, body2){
	return Math.pow(Math.pow((body2.x-body1.x),2)+Math.pow((body2.y-body1.y),2),0.5);
};

module.exports.updatePlayer = function(player){

	player.x = parseInt(player.x);
	player.y = parseInt(player.y);
	player.spdX = parseInt(player.spdX);
	player.spdY = parseInt(player.spdY);
	player.runSpd = parseInt(player.runSpd);
	//update the speed
	if(player.pressingRight && player.pressingRight != 'false') {
		player.spdX = player.runSpd;
	} else {
		if(player.pressingLeft && player.pressingLeft != 'false') {
			player.spdX = -(player.runSpd);
		} else
			player.spdX = 0;	
	}
	
	if(player.pressingUp && player.pressingUp != 'false') {
		player.spdY = -(player.runSpd);
	} else {
	 	if(player.pressingDown && player.pressingDown != 'false') {
	 		player.spdY = player.runSpd;
		} else
			player.spdY = 0;
	}
	

	//update the position
	player.x += player.spdX;
	player.y += player.spdY;
	if(player.x>CONSTANTS.canvasSize.x) 
		player.x = CONSTANTS.canvasSize.x;
	if(player.x<0) 
		player.x = 0;
	if(player.y>CONSTANTS.canvasSize.y) 
		player.y = CONSTANTS.canvasSize.y;
	if(player.y<0) 
		player.y = 0;
};

module.exports.updateBullet = function(bullet){

	bullet.x = parseInt(bullet.x);
	bullet.y = parseInt(bullet.y);
	bullet.spdX = parseInt(bullet.spdX);
	bullet.spdY = parseInt(bullet.spdY);
	
	//update the position
	bullet.x += bullet.spdX;
	bullet.y += bullet.spdY;
	if(bullet.x>CONSTANTS.canvasSize.x || bullet.x<0 || bullet.y>CONSTANTS.canvasSize.y || bullet.y<0)  
		return true;
};

/*Player.onConnect = function(socket){
	var player = Player(socket.id);
	
Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
}
Player.update = function(){
	for(var i in Player.list){
		var player = Player.list[i];
		player.update();
		pack.push({
			x:player.x,
			y:player.y,
			number:player.number
		});		
	}
	return pack;
}


var Bullet = function(angle){
	var self = Entity();
	self.id = Math.random();
	self.spdX = Math.cos(angle/180*Math.PI) * 10;
	self.spdY = Math.sin(angle/180*Math.PI) * 10;
	
	self.timer = 0;
	self.toRemove = false;
	var super_update = self.update;
	self.update = function(){
		if(self.timer++ > 100)
			self.toRemove = true;
		super_update();
	}
	Bullet.list[self.id] = self;
	return self;
}
Bullet.list = {};

Bullet.update = function(){
	if(Math.random() < 0.1){
		Bullet(Math.random()*360);
	}
	
	var pack = [];
	for(var i in Bullet.list){
		var bullet = Bullet.list[i];
		bullet.update();
		pack.push({
			x:bullet.x,
			y:bullet.y,
		});		
	}
	return pack;
}
*/
/*var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	
	Player.onConnect(socket);
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);
	});
	
	
	
	
});*/


/*//index.html
<canvas id="ctx" width="500" height="500" style="border:1px solid #000000;"></canvas>

<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
<script>
	var ctx = document.getElementById("ctx").getContext("2d");
	ctx.font = '30px Arial';
	
	var socket = io();
		
	socket.on('newPositions',function(data){
		ctx.clearRect(0,0,500,500);
		for(var i = 0 ; i < data.player.length; i++)
			ctx.fillText(data.player[i].number,data.player[i].x,data.player[i].y);		
			
		for(var i = 0 ; i < data.bullet.length; i++)
			ctx.fillRect(data.bullet[i].x-5,data.bullet[i].y-5,10,10);		
	});
	
</script>*/