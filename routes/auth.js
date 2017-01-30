var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var models = require('../models.js');
var utils = require('../utils.js');
var validator = require('validator');
//var models = require('../models');
//var utils = require('../utils');
var path = require('path');

mongoose.Promise = require('bluebird');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * Render the registration page.
 */
router.get('/register',function(req, res) {
	//res.sendFile(path.resolve(__dirname+'/../client/views/register.html'));
  	res.render('register.hbs', {csrfToken: req.csrfToken()});
});

/**
 * Register the user.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/register', function(req, res) {
	req.body.name = validator.trim(req.body.name.toString(), ['~','`','!','@','#','\\$','%','^','&','*','\\(','\\)','\\/','-','_','+','=','\\{','\\}','\\[',';',':','\\<','\\>',',','.','?','|','\\]',' ']);
	req.body.name = validator.blacklist(req.body.name, '~`!@#$%^&*\\(\\)\\-/_+=\\{\\}\\[;:<>,?|\\]');
	req.body.email = validator.trim(req.body.email.toString(), [' ']);
	req.body.password = req.body.password.toString();
	
	var salt = bcrypt.genSaltSync(10);
  	var hash = bcrypt.hashSync(req.body.password, salt);
  	
  	var errorMsg = '';
  	var invalid = false;

  	if(validator.isEmpty(req.body.name)) {
  		invaid = true;
  		errorMsg += 'Name is required.\n';
  	}

  	if(!validator.isEmail(req.body.email)) {
  		invalid = true;
  		errorMsg += '\nThat email is not a valid one.\n';
  	}

  	if(!validator.isLength(req.body.password, {min: 6})) {
  		invalid = true; 
  		errorMsg += '\nPassword must be atleast six characters.\n'
  	}

  	if(invalid) {
  		return res.render('register.hbs', {csrfToken: req.csrfToken(), error: errorMsg});
  	}

	var user = new models.User({
	    name: req.body.name,
	    email: req.body.email,
	    password: hash
	});

	user.save(function(err, user) {
	    if (err) {
	    	var errorMsg = 'Something bad happened! Please try again.';

	        if (err.code === 11000) {
	            errorMsg = 'That email is already taken, please try another.';
	        }
	        res.render('register.hbs', {csrfToken: req.csrfToken(), error: errorMsg});
	    } else {
	        utils.createUserSession(req, res, user);
	        res.redirect('/lobby');
	    }
	});
});


/**
 * Render the login page.
 */
router.get('/login',function(req, res) {
	//res.sendFile(path.resolve(__dirname+'/../client/views/login.html'));
 	res.render('login.hbs', { csrfToken: req.csrfToken()});
});

/**
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/login', function(req, res) {
	req.body.email = req.body.email.toString();
	req.body.password = req.body.password.toString();
	models.User.findOne({ email: req.body.email }, 'name email password', function(err, user) {
	    if(err) {
	    	var errorMsg = 'Something bad happened! Please try again.';
	    	res.render('register.hbs', {csrfToken: req.csrfToken(), error: errorMsg});
	    } else {
	    	if (!user) {
		      res.render('login.hbs', { error: "No user registered with that EmailId.", csrfToken: req.csrfToken() });
		    } else {
		    	if (bcrypt.compareSync(req.body.password, user.password)) {
		        	utils.createUserSession(req, res, user);
		        	res.redirect('/lobby');
		      	} else {
		        	res.render('login.hbs', { error: "Incorrect password.", csrfToken: req.csrfToken() });
		      	}
		    }
	    }
	});
});

/**
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/logout', function(req, res) {
  if (req.session) {
    req.session.destroy(function(err){
    	res.redirect('/');
    });
  }
});


module.exports = router;