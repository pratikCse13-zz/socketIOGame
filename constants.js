if(process.env.NODE_ENV == 'production') {
	module.exports = {
		port: 6001,								//port on which the server will listen
		sessionDuration: 60*60*1000,			//validity duration of a session
		sessionStretchDuration: 5*60*1000,		//validity extension duration of a session
		roomCapacity: 4,						//capacity of a game lobby
		canvasSize: {x: 1200, y: 400},			//size of the game frame
		fps: 40,								//number of frames per second the game will deliver
		bulletSpeed: 50,						//speed of the bullet shoot by user
		collisionDistance: 30,					//maximum distance between two entities to collide 
		sessionSecretKey: 'RMA007',				//sesion secret key
		sessionCookieKey: 'session',			//key with which session will be stored in browser
		passwordLength: 6,						//minimum length of password accepted
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 300}, {x: 0, y: 300}],   //start postiion of players
		barrierPositions: [{x: 1000, y: 500}],	//position of in-game barriers
		dbUrl: 'mongodb://localhost/game-prod'	//url of the mongoDB database server
	};
}
if(process.env.NODE_ENV == 'staging') {
	module.exports = {
		port: 6001,								//port on which the server will listen
		sessionDuration: 60*60*1000,			//validity duration of a session
		sessionStretchDuration: 5*60*1000,		//validity extension duration of a session
		sessionSecretKey: 'RMA007',				//capacity of a game lobby
		roomCapacity: 4,						//size of the game frame
		canvasSize: {x: 1200, y: 400},			//number of frames per second the game will deliver
		fps: 40,								//speed of the bullet shoot by user
		bulletSpeed: 50,						//maximum distance between two entities to collide
		passwordLength: 6,						//sesion secret key
		collisionDistance: 30,					//key with which session will be stored in browser
		sessionCookieKey: 'session',			//minimum length of password accepted
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],	//start postiion of players
		barrierPositions: [{x: 1000, y: 500}],	//position of in-game barriers
		dbUrl: 'mongodb://localhost/game-pre-prod'	//url of the mongoDB database server
	};	
}
if(process.env.NODE_ENV == 'integration') {
	module.exports = {
		port: 6001,								//port on which the server will listen
		sessionDuration: 60*60*1000,			//validity duration of a session
		sessionStretchDuration: 5*60*1000,		//validity extension duration of a session
		sessionSecretKey: 'RMA007',				//capacity of a game lobby
		roomCapacity: 4,						//size of the game frame
		canvasSize: {x: 1200, y: 400},			//number of frames per second the game will deliver
		fps: 40,								//speed of the bullet shoot by user
		bulletSpeed: 50,						//maximum distance between two entities to collide
		passwordLength: 6,						//sesion secret key
		collisionDistance: 30,					//key with which session will be stored in browser
		sessionCookieKey: 'session',			//minimum length of password accepted
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],	//start postiion of players
		barrierPositions: [{x: 1000, y: 500}],	//position of in-game barriers
		dbUrl: 'mongodb://localhost/game-pre-prod'	//url of the mongoDB database server
	};
}

