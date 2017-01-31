var CONSTANTS = require('../constants.js');

//Player Constructor
module.exports.Player = function(id, x, y){
	return {
		x: x,					//x-coordinate of the player on the canvas
		y: y,					//y-coordinate of the player on the canvas
		spdX: 0,				//move speed of the player in x-axis
		spdY: 0,				//move speed of the player in y-axis
		id: id,					//socket id of the player
		number: "" + Math.floor(10 * Math.random()),
		pressingRight: false,	//flag to record if the user is pressing the right direction key
		pressingLeft: false,	//flag to record if the user is pressing the left direction key
		pressingUp: false,		//flag to record if the user is pressing the up direction key
		pressingDown: false,	//flag to record if the user is pressing the down direction key
		runSpd: 10,				//the moving speed of the player
	
	}
}

//Bullet Constructor
module.exports.Bullet = function(id, x, y, spdX, spdY){
	return {
		x: x,					//x-coordinate of the bullet on the canvas
		y: y,					//y-coordinate of the bullet on the canvas
		id: id,					//unique id to reconize which user the bullet belongs
		spdX: spdX,				//move speed of the bullet in x-axis
		spdY: spdY				//move speed of the bullet in y-axis
	}
}

//calculate the distance between two entities
module.exports.getDistance = function(body1, body2){
	return Math.pow(Math.pow((body2.x-body1.x),2)+Math.pow((body2.y-body1.y),2),0.5);
};

//update a player's position
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

//update a bullet's position
module.exports.updateBullet = function(bullet){

	bullet.x = parseInt(bullet.x);
	bullet.y = parseInt(bullet.y);
	bullet.spdX = parseInt(bullet.spdX);
	bullet.spdY = parseInt(bullet.spdY);
	
	//update the position
	bullet.x += bullet.spdX;
	bullet.y += bullet.spdY;
	if(bullet.x>=CONSTANTS.canvasSize.x || bullet.x<=0 || bullet.y>=CONSTANTS.canvasSize.y || bullet.y<=0)  
		return true;
};
