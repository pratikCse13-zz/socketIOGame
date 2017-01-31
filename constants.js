if(process.env.NODE_ENV == 'production') {
	module.exports = {
		port: 6000,
		sessionDuration: 60*60*1000,
		sessionStretchDuration: 5*60*1000,
		roomCapacity: 4,
		canvasSize: {x: 1200, y: 400},
		fps: 40,
		bulletSpeed: 50,
		collisionDistance: 40,
		sessionSecretKey: 'RMA007',
		sessionCookieKey: 'session',
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 300}, {x: 0, y: 300}],
		barrierPositions: [{x: 200, y: 130}, {x: 800, y: 100}, {x: 800, y: 210}, {x: 200, y: 350},
						   {x: 200, y: 50}, {x: 800, y: 130}, {x: 500, y: 250}, {x: 400, y: 130}, {x: 400, y: 230}
						   , {x: 600, y: 400}, {x: 550, y: 70}, {x: 350, y: 190}, {x: 200, y: 310}],
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
		canvasSize: {x: 1200, y: 400},
		fps: 40,
		bulletSpeed: 50,
		collisionDistance: 40,
		sessionCookieKey: 'session',
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],
		barrierPositions: [{x: 200, y: 130}, {x: 800, y: 100}, {x: 800, y: 210}, {x: 200, y: 350},
						   {x: 200, y: 50}, {x: 800, y: 130}, {x: 500, y: 250}, {x: 400, y: 130}, {x: 400, y: 230}
						   , {x: 600, y: 400}, {x: 550, y: 70}, {x: 350, y: 190}, {x: 200, y: 310}],
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
		canvasSize: {x: 1200, y: 400},
		fps: 40,
		bulletSpeed: 50,
		collisionDistance: 40,
		sessionCookieKey: 'session',
		startPositions: [{x: 0, y: 0}, {x: 500, y: 0}, {x: 500, y: 500}, {x: 0, y: 500}],
		barrierPositions: [{x: 200, y: 130}, {x: 800, y: 100}, {x: 800, y: 210}, {x: 200, y: 350},
						   {x: 200, y: 50}, {x: 800, y: 130}, {x: 500, y: 250}, {x: 400, y: 130}, {x: 400, y: 230}
						   , {x: 600, y: 400}, {x: 550, y: 70}, {x: 350, y: 190}, {x: 200, y: 310}],
		dbUrl: 'mongodb://localhost/game-dev'
	};
}

