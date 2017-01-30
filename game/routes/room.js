var express = require('express');
var router = express.Router();
var path = require('path');
var models = require('../models.js');
var bcrypt = require('bcryptjs');
var async = require('async');

router.use(function(req, res, next){
    console.log(req.session)
	if (req.session && req.session.user) {
        models.User.findOne({ email: req.session.user.email }, 'name email', function(err, user) {
            if (user) {
                utils.createUserSession(req, res, user);
                next();
            } else {
                res.status(400).send('user could not be authenticated');
            }
        });
    } else {
        res.status(400).send('user could not be authenticated');
    }
});

router.get('/rooms', function(req, res) {
    console.log(req.session);
    models.Room.find({}, function(err, rooms){
        if(err) {
            res.status(400).send('Something bad happened! Please try again.');
        } else{
            console.log('rooms')
            console.log(rooms)
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

    if(req.body.name != undefined)
        req.body.name = validator.trim(req.body.name.toString(), [' ']);
        if(validator.isEmpty(req.body.name)) {
            invaid = true;
            errorMsg += 'Name is required.\n';
        }
    else {
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
        return res.status(400).send(errorMsg);//render(, {csrfToken: req.csrfToken(), error: errorMsg});
    }

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
            res.status(400).send(errorMsg);//res.render('register.hbs', {csrfToken: req.csrfToken(), error: errorMsg});
        } else {
            utils.createUserSession(req, res, user);
            res.send(room);
        }
    });  
});

router.post('/join', function(req, res){
    async.waterfall([
        function(callback){
            models.Room.findById(req.roomId, function(err, room){
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
            if(!bcrypt.compareSync(req.body.roomPassword, user.password)) {
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
    ], function(err, result){
        if(err) {
            res.status(400).send(err.message);    
        } else {
            res.send(room);
        }   
    });
});

router.post('/leave', function(req, res){
    async.waterfall([
        function(callback){
            models.Room.findById(req.roomId, function(err, room){
                if(err) {
                    err.message = 'Something bad happened! Please try again.'; 
                    return callback(err, null);
                } else {
                    callback(null, room);
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
            res.send(room);
        }   
    });
});

module.exports = router;
