if(process.env.NODE_ENV == 'production') {
	module.exports = {
		port: 8000,
		sessionDuration: 10*60*1000,
		sessionStretchDuration: 5*60*1000,
		sessionSecretKey: 'RMA007',
		roomCapacity: 4,
		sessionCookieKey: 'session',
		dbUrl: 'mongodb://localhost/game-prod'
	};
}
if(process.env.NODE_ENV == 'staging') {
	module.exports = {
		port: 8001,
		sessionDuration: 10*60*1000,
		sessionStretchDuration: 5*60*1000,
		sessionSecretKey: 'RMA007',
		roomCapacity: 4,
		sessionCookieKey: 'session',
		dbUrl: 'mongodb://localhost/game-pre-prod'
	};	
}
if(process.env.NODE_ENV == 'integration') {
	module.exports = {
		port: 8002,
		sessionDuration: 10*60*1000,
		sessionStretchDuration: 5*60*1000,
		sessionSecretKey: 'RMA007',
		roomCapacity: 4,
		sessionCookieKey: 'session',
		dbUrl: 'mongodb://localhost/game-dev'
	};
}
