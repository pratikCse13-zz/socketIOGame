var express = require('express');
var router = express.Router();
var path = require('path');
var utils = require('../utils/utils.js');
var request = require('request');
var async = require('async');
var models = require('../models.js');
/**
 * Render the home page.
 */
router.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname+'/../client/views/index.html'));
});

/**
 * Render the lobby page.
 */
router.get('/lobby', function(req, res) {
	models.Room.find({}, function(err, rooms){
		res.render('lobby.hbs', {rooms: rooms, csrfToken: req.csrfToken()});
	});
});

module.exports = router;
