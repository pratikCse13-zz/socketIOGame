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
