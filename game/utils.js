var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var session = require('express-sessions');

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