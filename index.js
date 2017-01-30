var CONSTANTS = require('./constants.js');
var express = require('express');
var routes = require('./routes/routes');
var auth = require('./routes/auth');
var room = require('./routes/room');
var csrf = require('csurf');
var morgan = require('morgan');
var middlewares = require('./middlewares');
var path = require('path');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var sharedSession = require("express-socket.io-session");
var utils = require('./utils.js');
var gameUtils = require('./gameUtils.js');
var async = require('async');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketRedis = require('socket.io-redis');
io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

var redis = require('redis');
var redisClient = redis.createClient();



app.use(express.static(path.join(__dirname,'/client')));
app.set('views', path.join(__dirname, '/client/views/'));
app.engine('handlebars', expressHbs({extname: '.hbs'}));
app.set('view engine', 'handlebars');
app.set('view options', {
    layout: false
});

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser());

var MongoStore = require('connect-mongo')(require('express-session'));

app.use(morgan('dev'));

var session = require('express-session')({
	secret: CONSTANTS.sessionSecretKey,
    resave: false,
    saveUninitialized: false,
    key: 'jsessionid',
    store: new MongoStore({
      	url: CONSTANTS.dbUrl,
      	autoRemove: 'native' 
    }), 
    cookie: {
	    //httpOnly: true, // when true, cookie is not accessible from javascript 
	    //secure: false, // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process 
		maxAge: CONSTANTS.sessionDuration
	}
});

app.use(session);

io.use(sharedSession(session, {
    autoSave:true
}));

app.use(csrf({cookie: true}));

app.use(middlewares.authenticate);

app.use(routes);
app.use(auth);
app.use(room);


redisClient.on('connect', function(){
	io.on('connection', function(socket){
		//console.log('socket.handshake.session.user')
		//console.log(socket.handshake.session.user)

		/*socket.on('connect', function(){
			console.log('firing connect')
			if(socket.handshake.session.user) {
				io.of('/').adapter.allRooms(function (err, rooms) {
				  	if(err) {
				  		socket.emit('roomListFetchError', {errorMsg: 'Something Bad Happened!! Please try again.'});
				  	} else {
				  		socket.emit('roomList', {rooms: rooms}); 
					}
				});
			} else {
				socket.emit('roomListFetchError', {errorMsg: 'Sorry User could not be authenticated!! Please try again.'});
			}
		});*/

		socket.on('getRooms', function(data){
			if(socket.handshake.session.user) {
				async.waterfall([
					function(callback){
						io.of('/').adapter.allRooms(function (err, rooms) {
							if(err) {
								err.message = 'Something bad happened. Please try again.';
								return callback(err, null);
							} else {
								return callback(null, rooms);
							}
						});		
					},
					function(rooms, callback){
						io.of('/').adapter.clients(function (err, clients) {
							if(err) {
								err.message = 'Something bad happened. Please try again.';
								return callback(err, null);
							} else {
								clients.forEach(function(client){
									if(rooms.indexOf(client) != -1) {
										rooms.splice(rooms.indexOf(client), 1);
									}
								});
								return callback(null, rooms);
							}
						});	
					}
				], function(err, rooms){
					if(err) {
				  		socket.emit('roomListFetchError', {errorMsg: err.message});
				  	} else {
				  		// console.log('matture rooms')
				  		// console.log(rooms)
				  		socket.emit('roomList', {rooms: rooms}); 
					}
				});
			} else {
				socket.emit('roomListFetchError', {errorMsg: 'Sorry User could not be authenticated!! Please try again.'});
			}
		});
		
		//create room event
		socket.on('createRoom', function(roomDetails){
			console.log('socket.handshake.session.user in createRom')
			console.log(socket.handshake.session.user)
			console.log('createRoom called')
			//create the room in redis client
			redisClient.del(socket.id+'||'+roomDetails.roomName+'||'+socket.handshake.session.user.name);
			redisClient.set(socket.id+'||'+roomDetails.roomName+'||'+socket.handshake.session.user.name,roomDetails.password);
			//make the socket leave all rooms except the one with its own id and join this new room hence creating it 
			utils.createRoom(io, socket, roomDetails, function(status){

				console.log('returned from util')
				if(status) {
					roomDetails.ownerName = socket.handshake.session.user.name;
					roomDetails.ownerSocketId = socket.id;
					delete roomDetails.password;
					socket.emit('createdRoom', roomDetails);
					socket.emit('update', {msg: 'created new room: '+roomDetails.roomName});  
					console.log('reaching')		  	
					//publishing to all the clients new room is created
					io.of('/').adapter.clients(function(err, clients){
						clients.forEach(function(client){
							io.of('/').in(client).emit('newRoom', roomDetails);
						});
					});	
				} else {
					console.log('other')
					socket.emit('createRoomError', {errorMsg: 'Something bad happaend. Please try again.'});
				}
			});
			
		});

		socket.on('joinRoom', function(roomDetails){
			console.log('join request')
			console.log(roomDetails)
			var roomExtension = roomDetails.ownerSocketId+'||'+roomDetails.roomName+'||'+roomDetails.ownerName;
			async.waterfall([
				//fetch all the rooms currently existing
				function(callback){
					io.of('/').adapter.allRooms(function(err, rooms){
						if(err) {
							err.message = 'Something bad happened. Please try again.';
							return callback(err, null);
						} else {
							return callback(null, rooms);
						}
					});		
				},
				//check for existence of room in redis adapter and fetch its password
				function(rooms, callback){
					if(rooms.indexOf(roomExtension) != -1) {
						redisClient.get(roomExtension, function(err, roomPassword){
							if(err) {
								err.message = 'Something bad happened. Please try again.';
								return callback(err, null);
							} else {
								return callback(null, roomPassword);
							}
						}); 	
					} else {
						return callback(new Error('No such room exists.'), null);
					}
				},
				//match the passwords
				function(roomPassword, callback){
					if(roomPassword !== roomDetails.password) {
						console.log('no')
						console.log(roomPassword)
						console.log(roomDetails.password)
						return callback(new Error('Password Mismatch!'), null);
					} else {
						return callback(null);	
					}
				},
				//make the socket leave all other rooms and join this one
				function(callback){
					utils.joinRoom(io, socket, roomDetails, function(status, errorMsg){
						if(status) {
							socket.emit('joinedRoom', roomDetails);
							return callback(null);
						} else {
							return callback(new Error(errorMsg), null);
						} 
					});
				},
				//update to all members of the room of this new joinee
				function(callback){
					io.of('/').adapter.clients([roomExtension], function (err, clients) {
						if(err) {
							return callback(new Error('Something bad happened. Please try again.'), null);
						} else {
							clients.forEach(function(client){
								io.of('/').to(client).emit('update', {msg: socket.handshake.session.user.name+' has joined the room.'});
							});
						}
					});
				}
			], function(err){
				if(err) {
					socket.emit('joinRoomError', {errorMsg: err.message});
				}
			});
		});

		socket.on('leaveRoom', function(roomDetails){
			var roomExtension = roomDetails.ownerSocketId+'||'+roomDetails.roomName+'||'+roomDetails.ownerName;
			async.series([
				function(callback){
					io.of('/').adapter.remoteLeave(socket.id, roomExtension, function(err){
						if(err) {
							err.message = 'Something bad happaend. Please try again.';
							return callback(err, null);							
						} else {
							socket.emit('leftRoom', {msg: 'Successfully Left room!!'});
							return callback(null);
						}
					});	
				},
				//remove this players data from the game in redis client**********************************
				function(callback){
					io.of('/').adapter.clients([roomExtension], function(err, clients){
						if(!err){
							if(clients.length != 0) {
								clients.forEach(function(client){
									io.of('/').to(client).emit('update', {msg: socket.handshake.session.user.name+' has left the room.'});
								});
							}
						}
						return callback(null);
					})
				}
			], function(err){
				if(err) {
					socket.emit('leaveRoomError', {errorMsg: err.message});
				}
			});
		});

		socket.on('keyPress',function(data) {
			console.log('key press called')
			console.log(data)
			//fetch the player from redis
			redisClient.hgetall(socket.id, function(err, player){
				if(!err) {
					if(data.inputId === 'left')
						player.pressingLeft = data.state;
					else if(data.inputId === 'right')
						player.pressingRight = data.state;
					else if(data.inputId === 'up')
						player.pressingUp = data.state;
					else if(data.inputId === 'down')
							player.pressingDown = data.state;
					redisClient.hmset(socket.id, player);
				}
			});
		});

		socket.on('shoot', function(data){
			console.log('shoot called')
			var roomExtension = data.roomDetails.ownerSocketId+'||'+data.roomDetails.roomName+'||'+data.roomDetails.ownerName;
			var bulletId = roomExtension+'||'+socket.id;
			redisClient.hgetall(socket.id, function(err, player){
				data.x -= player.x;
				data.y -= player.y;
				angle = Math.random()*360;//Math.atan2(data.y,data.x);
				spdX = Math.ceil(CONSTANTS.bulletSpeed * Math.cos(angle/180*Math.PI));
				spdY = Math.ceil(CONSTANTS.bulletSpeed * Math.sin(angle/180*Math.PI));
				var bullet = gameUtils.Bullet(bulletId, parseInt(player.x), parseInt(player.y), spdX, spdY);
				redisClient.sadd(roomExtension+'||bullets', bulletId);
				redisClient.hmset(bulletId, bullet);
			});
		});

		socket.on('startGame', function(roomDetails){
			console.log('socket.handshake.session.user in start game')
			console.log(socket.handshake.session.user)
			console.log('roomDetails in start game')
			console.log(roomDetails)
			if(roomDetails.ownerSocketId == undefined || roomDetails.ownerName == undefined) {
				socket.emit('startGameError', {errorMsg: 'Something went wrong!'});
			} else {
				var roomExtension = roomDetails.ownerSocketId+'||'+roomDetails.roomName+'||'+roomDetails.ownerName;
				console.log('here')
				console.log(roomExtension)
				async.waterfall([
					//get all the socket id connected to this room
					function(callback){
						io.of('/').adapter.clients([roomExtension], function(err, socketIds){
							if(err) {
								err.message = 'Somethign bad happened. Please try again.'
								return callback(err, null);
							} else {
								console.log('socketIds')
								console.log(socketIds)
								return callback(null, socketIds);
							}
						});	
					},
					//initialize players for these sockets
					function(socketIds, callback){
						for(var i=0;i<socketIds.length;i++) {
							var player = gameUtils.Player(socketIds[i], CONSTANTS.startPositions[i].x, CONSTANTS.startPositions[i].y);
							console.log('created PLayer')
							console.log(player.x)
							console.log(player.y)
							console.log(player.spdX)
							console.log(player.spdY)
							redisClient.del(socketIds[i]);
							redisClient.hmset(socketIds[i], player);
						}
						redisClient.del(roomExtension+'||players');
						socketIds.forEach(function(socketId){
							redisClient.sadd(roomExtension+'||players', socketId);	
						});
						return callback(null, socketIds);
					},
					/*//initialize bullets
					function(socketIds, callback){
						//for bullets
						redisClient.del(roomExtension+'||bullets');
						
						return callback(null, socketIds);
					},*/
					//fire game started event to these sockets
					function(socketIds, callback){
						//start emitting frames
						var timerId = setInterval(function(){
							var frame = {};
							frame.players = [];
							frame.bullets = [];
							//search for sockets connected to this room
							io.of('/').adapter.clients([roomExtension], function(err, socketIds){
								async.parallel({
									//get players from redis and update their position
									players: function(innerCallback){
										//get the players from redis
										async.waterfall([
											function(nestedCallback){
												redisClient.smembers(roomExtension+'||players', function(err, playerIds){
													if(err) {
														nestedCallback(err, null);
													} else {
														nestedCallback(null, playerIds);
													}
												});	
											},
											function(playerIds, nestedCallback){
												async.each(playerIds, function(playerId, cb){
													redisClient.hgetall(playerId, function(err, player){
														if(err) {
															cb(err, null);
														} else {
															if(player != undefined && player != null) {
																gameUtils.updatePlayer(player);
																redisClient.hmset(playerId, player);
																frame.players.push(player);		
															}
															cb(null, null);
														}
													});
												}, function(err){
													if(err) {
														nestedCallback(err);
													} else {
														nestedCallback(null);
													}
												});
											}
										], function(err){
											if(err) {
												innerCallback(err, null);
											} else {
												innerCallback(null, null);
											}
										});
									},
									bullets: function(innerCallback){
										async.waterfall([
											function(nestedCallback){
												redisClient.smembers(roomExtension+'||bullets', function(err, bulletIds){
													if(err) {
														nestedCallback(err, null);
													} else {
														nestedCallback(null, bulletIds);
													}
												});	
											},
											function(bulletIds, nestedCallback){
												async.each(bulletIds, function(bulletId, cb){
													redisClient.hgetall(bulletId, function(err, bullet){
														if(err) {
															cb(err, null);
														} else {
															if(bullet != undefined && bullet != null) {
																console.log('bullet befoer update')
																console.log(bullet)
																var removeBullet = gameUtils.updateBullet(bullet);
																if(removeBullet) {
																	redisClient.srem(roomExtension+'||bullets', bulletId);	
																	redisClient.del(bulletId);
																} else {
																	redisClient.hmset(bulletId, bullet);
																	frame.bullets.push(bullet);
																}
																console.log('bullet after update')
																console.log(bullet)		
															}
															cb(null, null);
														}
													});
												}, function(err){
													if(err) {
														nestedCallback(err);
													} else {
														nestedCallback(null);
													}
												});
											}
										], function(err){
											if(err) {
												innerCallback(err, null);
											} else {
												innerCallback(null, null);
											}
										});
									},
									barriers: function(innerCallback){
										frame.barriers = CONSTANTS.barrierPositions;
										return innerCallback(null, null);
									}
								}, function(err, results){
									//check for collision
									frame.bullets.forEach(function(bullet){
										frame.players.forEach(function(player){
											if(gameUtils.getDistance(bullet, player)<=CONSTANTS.collisionDistance &&
												bullet.id.split('||')[3] != player.id){
												//remove bullet from current frame
												frame.bullets.splice(frame.bullets.indexOf(bullet), 1);
												//remove bullet from bullets collection in redis
												redisClient.srem(roomExtension+'||bullets', bullet.id);
												//remove bullet from redis memory
												redisClient.del(bullet.id);
												//remove player from current frame
												frame.players.splice(frame.players.indexOf(player), 1);
												//remove player from players collection in redis
												redisClient.srem(roomExtension+'||players', player.id);
												//remove player from redis memory
												redisClient.del(player.id);
												io.of('/').to(player.id).emit('gameOver', {});
											}
										});
										frame.barriers.forEach(function(barrier){
											if(gameUtils.getDistance(bullet, barrier)<=CONSTANTS.collisionDistance){
												//remove bullet from current frame
												frame.bullets.splice(frame.bullets.indexOf(bullet), 1);
												//remove bullet from bullets collection in redis
												redisClient.srem(roomExtension+'||bullets', bullet.id);
												//remove bullet from redis memory
											}
										});
									});
									socketIds.forEach(function(socketId){
										io.of('/').to(socketId).emit('newFrame', frame);
									});
								});
							});
						}, 1000/CONSTANTS.fps);
						return callback(null, socketIds, timerId);
					},
					//indicate to all the members that the game has started
					function(socketIds, timerId, callback){
						socketIds.forEach(function(socketId){
							io.of('/').to(socketId).emit('gameStarted', {});
						});	
						return callback(null, timerId);
					},
				], function(err, result){
					socket.emit('timerId', {});
				});
				
				
				//start loop
					//fetch and update the player position
					//fetch and update the bullet position
					//fetch barriers
					//check for collisions
						//if true fire game over events
						//remove bullets
					//create pack
					//send frame
				//end loop
			}
		});

		socket.on('disconnect', function(){

		});

	}); 
});



server.listen(process.env.PORT || CONSTANTS.port,function(){
	console.log('server listening at port '+ (process.env.PORT || CONSTANTS.port));
});
