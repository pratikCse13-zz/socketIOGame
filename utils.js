var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var session = require('express-sessions');
var async = require('async');
var CONSTANTS = require('./constants.js');
/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
module.exports.createUserSession = function(req, res, user) {
  	var cleanUser = {
    	name:   user.name,
    	email:  user.email,
    	id: user._id
  	};

  	req.session.user = cleanUser;
  	req.user = cleanUser;
  	res.locals.user = cleanUser;
};

module.exports.joinRoom = function(io, socket, roomDetails, cb){
	//making the creator leave all rooms apart from the one with his own id
	io.of('/').adapter.clientRooms(socket.id, function (err, rooms) {
	  	async.each(rooms, function(room, callback){
	  		if(room != socket.id) {
		  		io.of('/').adapter.remoteLeave(socket.id, room, function (err) {
				  	if (err) {
				  		return callback(err);
				  	} else {
				  		return callback(null);
				  	}	
				});
		  	} else {
		  		return callback(null);
		  	}
	  	}, function(err){
	  		if(err) {
	  			return cb(false, 'Something bad happened. Please try again.');
	  		} else {
	  			//make the creator join the room
	  			var roomExtension = roomDetails.ownerSocketId+'||'+roomDetails.roomName+'||'+roomDetails.ownerName;
	  			io.of('/').adapter.clients(roomExtension,function(err, clients){
	  				if(err) {
	  					return cb(false, 'Something bad happened. Please try again.');
	  				} else {
	  					if(clients.length<CONSTANTS.roomCapacity) {
	  						io.of('/').adapter.remoteJoin(socket.id, roomExtension, function (err) {
							  	if (err) {
							  		return cb(false, 'Something bad happened. Please try again.');
	  							} else {
							  		cb(true, 'Successfully Joined.');
								}
							});
	  					} else {
	  						return cb(false, 'Room Capacity Full.');
	  					}
	  				}
	  			});
	  		}
	  	});
	});
};

module.exports.createRoom = function(io, socket, roomDetails, cb){
	//making the creator leave all rooms apart from the one with his own id
	io.of('/').adapter.clientRooms(socket.id, function (err, rooms) {
	  	async.each(rooms, function(room, callback){
	  		if(room != socket.id) {
		  		io.of('/').adapter.remoteLeave(socket.id, room, function (err) {
				  	if (err) {
				  		return callback(err);
				  	} else {
				  		return callback(null);
				  	}	
				});
		  	} else {
		  		return callback(null);
		  	}
	  	}, function(err){
	  		if(err) {
	  			return cb(false);
	  		} else {
	  			//make the creator join the room
	  			var roomExtension = socket.id+'||'+roomDetails.roomName+'||'+socket.handshake.session.user.name;
	  			io.of('/').adapter.remoteJoin(socket.id, roomExtension, function (err) {
				  	if (err) {
				  		console.log('error in joinging')
				  		console.log(err)
				  		cb(false);
				  	} else {
				  		cb(true);
					}
				});
	  		}
	  	});
	});
};