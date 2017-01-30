
var Player = function(id, x, y){

	var self = {
		x:x,
		y:y,
		spdX:0,
		spdY:0,
		id: id,
		number: "" + Math.floor(10 * Math.random()),
		pressingRight: false,
		pressingLeft: false,
		pressingUp: false,
		pressingDown: false,
		moveSpd: 10
	}

	self.findDirection = function(){
		if(self.pressingRight)
			self.spdX = self.moveSpd;
		if(self.pressingLeft)
			self.spdX = -self.moveSpd;
		if(!(self.pressingLeft || self.pressingRight))
			self.spdX = 0;
		
		if(self.pressingUp)
			self.spdY = self.moveSpd;
		if(self.pressingDown)
			self.spdY = -self.moveSpd;
		if(!(self.pressingUp || self.pressingDown))
			self.spdY = 0;		
	};

	self.movePlayer = function(){
		self.x += self.spdX;
		self.y += self.spdY;
	};
		
	Player.list[id] = self;
	return self;
}

Player.onConnect = function(socket){
	var player = Player(socket.id);
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
	});
}
Player.onDisconnect = function(socket){
	delete Player.list[socket.id];
}
Player.update = function(){
	var pack = [];
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

var Bullet = function(angle, x, y){
	var self = {
        x: x,
        y: y,
        spdX: Math.cos(angle/180*Math.PI) * 10,
        spdY: Math.sin(angle/180*Math.PI) * 10,
        id: Math.random(),
    	timer: 0,
		remove: false
    };
	
	self.update = function(){
		if(self.timer++ > 100)
			self.remove = true;
		self.x += self.spdX;
		self.y += self.spdY; 
	}
	return self;
}

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