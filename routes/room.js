var express = require('express');
var path = require('path');
var models = require('../models.js');
var bcrypt = require('bcryptjs');
var async = require('async');
var utils = require('../utils.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var validator = require('validator');
var models = require('../models.js');
var CONSTANTS = require('../constants.js');

mongoose.Promise = require('bluebird');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/rooms', function(req, res) {
    console.log(req.session);
    models.Room.find({}, function(err, rooms){
        if(err) {
            res.status(400).send('Something bad happened! Please try again.');
        } else{
            res.send({rooms: rooms});
        }
    });
});

/**
 * Render the lobby page.
 */
router.post('/room', function(req, res) {
    console.log('req.session')
    console.log(req.session)
    var errorMsg = '';
    var invalid = false;

    console.log('req.body')
    console.log(req.body)


    if(req.body.name != undefined) {
        req.body.name = validator.trim(req.body.name.toString(), [' ']);
        if(validator.isEmpty(req.body.name)) {
            invaid = true;
            errorMsg += 'Name is required.\n';
        }
	} else {
        invalid = true;
        errorMsg += 'Name is required.\n';
    }

    if(req.body.password != undefined) {
        req.body.password = req.body.password.toString();
        if(!validator.isLength(req.body.password, {min: 6})) {
            invalid = true; 
            errorMsg += '\nPassword must be atleast six characters.\n'
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);
        }
    } else {
        invalid = true;
        errorMsg += '\nPassword is required.\n'
    }

    if(invalid) {
    	models.Room.find({}, function(err, rooms){
			res.render('lobby.hbs', {rooms: rooms, csrfToken: req.csrfToken(), errorCreate: errorMsg});
		});
    } else {
    	var room = new models.Room({
	        name: req.body.name,
	        password: hash,
	        owner: req.session.user.id,
	        ownerName: req.session.user.name
	    });

	    room.save(function(err, room) {
	        if (err) {
	        	var errorMsg = 'Something bad happened! Please try again.';

	            if (err.code === 11000) {
	                errorMsg = 'User can only create one game at any time.';
	            }
	            models.Room.find({}, function(err, rooms){
					res.render('lobby.hbs', {rooms: rooms, csrfToken: req.csrfToken(), errorCreate: errorMsg});
				});
	        } else {
	            res.render('gamepage.hbs', {room: room, csrfToken: req.csrfToken()});
	        }
	    });
    }
});

router.post('/join', function(req, res){
	console.log('joining request')
    async.waterfall([
        function(callback){
            models.Room.findById(req.body.roomId, function(err, room){
                if(err) {
                    err.message = 'Something bad happened! Please try again.'; 
                    return callback(err, null);
                } else {
                    callback(null, room);
                }
            });
        },
        function(room, callback){
            console.log('adding user: '+req.session.user.id+'to room: '+room.name);
            if(!bcrypt.compareSync(req.body.roomPassword, room.password)) {
                return callback(new Error('Incorrect Password.'), null);
            }
            if(room.members.length<(CONSTANTS.roomCapacity-1)) {
                room.members.push(req.session.user.id);
                room.save(function(err, room){
                    if(err) {
                        err.message = 'Something bad happened! Please try again.';
                        return callback(err, null);
                    } else {
                        callback(null, room);
                    }
                });     
            } else {
                callback(new Error('Room is already full'), null);
            }
            
        }
    ], function(err, room){
        if(err) {
        	console.log('err blocj')
        	console.log(err.message)
            models.Room.find({}, function(error, rooms){
				res.render('lobby.hbs', {rooms: rooms, csrfToken: req.csrfToken(), errorJoin: err.message});
			});    
        } else {
        	console.log('joining block')
            res.render('gamepage.hbs', {room: room, csrfToken: req.csrfToken()});
        }   
    });
});

router.post('/leave', function(req, res){
	console.log(req.body)
    async.waterfall([
        function(callback){
            models.Room.findById(req.body.roomId, function(err, room){
                if(err) {
                    err.message = 'Something bad happened! Please try again.'; 
                    return callback(err, null);
                } else {
                	if(room) {
                    	callback(null, room);
                	} else {
                		return callback(new Error('You are not inside any room.'), null);
                	}
                }
            });
        },
        function(room, callback){
            console.log('removing user: '+req.session.user.id+'from room: '+room.name);
            var index = room.members.indexOf(req.session.user.id);
            room.members.splice(index, 1);
            room.save(function(err, room){
                if(err) {
                    err.message = 'Something bad happened! Please try again.';
                    return callback(err, null);
                } else {
                    callback(null, room);
                }
            });     
        }
    ], function(err, result){
        if(err) {
            res.status(400).send(err.message);    
        } else {
            res.redirect('/lobby');
        }   
    });
});

module.exports = router;
