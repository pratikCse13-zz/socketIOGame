if(process.env.NODE_ENV == 'production') {
	module.exports = {
		port: 6000,
		sessionDuration: 60*60*1000,
		sessionStretchDuration: 5*60*1000,
		roomCapacity: 4,
		canvasSize: {x: 1000, y: 500},
		fps: 40,
		bulletSpeed: 10,
		collisionDistance: 10,
		sessionSecretKey: 'RMA007',
		sessionCookieKey: 'session',
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],
		barrierPositions: [{x: 30, y: 0}, {x: 1000, y: 30}, {x: 1000, y: 470}, {x: 0, y: 470},
						   {x: 0, y: 30}, {x: 970, y: 0}, {x: 970, y: 500}, {x: 30, y: 500}],
		dbUrl: 'mongodb://localhost/game-prod'
	};
}
if(process.env.NODE_ENV == 'staging') {
	module.exports = {
		port: 6001,
		sessionDuration: 60*60*1000,
		sessionStretchDuration: 5*60*1000,
		sessionSecretKey: 'RMA007',
		roomCapacity: 4,
		canvasSize: {x: 1000, y: 500},
		fps: 40,
		bulletSpeed: 10,
		collisionDistance: 10,
		sessionCookieKey: 'session',
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],
		barrierPositions: [{x: 30, y: 0}, {x: 1000, y: 30}, {x: 1000, y: 470}, {x: 0, y: 470},
						   {x: 0, y: 30}, {x: 970, y: 0}, {x: 970, y: 500}, {x: 30, y: 500}],
		dbUrl: 'mongodb://localhost/game-pre-prod'
	};	
}
if(process.env.NODE_ENV == 'integration') {
	module.exports = {
		port: 6002,
		sessionDuration: 60*60*1000,
		sessionStretchDuration: 5*60*1000,
		sessionSecretKey: 'RMA007',
		roomCapacity: 4,
		canvasSize: {x: 1000, y: 500},
		fps: 40,
		bulletSpeed: 10,
		collisionDistance: 10,
		sessionCookieKey: 'session',
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],
		barrierPositions: [{x: 30, y: 0}, {x: 1000, y: 30}, {x: 1000, y: 470}, {x: 0, y: 470},
						   {x: 0, y: 30}, {x: 970, y: 0}, {x: 970, y: 500}, {x: 30, y: 500}],
		dbUrl: 'mongodb://localhost/game-dev'
	};
}

