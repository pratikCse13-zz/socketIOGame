var models = require('./models.js');
var utils = require('./utils/utils.js');

/**
 * An authentication middleware.
 *
 * This will be the first middleware to execute, will check for sessions and their validations
 * 
 * If no session exists this will redirect to homepage otherwise to lobby
 */
module.exports.authenticate = function(req, res, next) {
    if (req.session && req.session.user) {
        //find the user with this email id
        models.User.findOne({ email: req.session.user.email }, 'name email', function(err, user) {
            //if user exists
            if (user) {
                //create the session of the user
                utils.createUserSession(req, res, user);
                switch(req.path){
                  case '/': 
                      res.redirect('/lobby');
                      break;
                  case '/lobby': 
                      next();
                      break;
                  case '/login': 
                      res.redirect('/lobby');
                      break;
                  case '/register': 
                      res.redirect('/lobby');
                      break;
                  default:
                      next();
                }
            //redirect user to home page
            } else {
                  res.redirect('/');
            }
        });
    } else {
        //if the user is not logged in redirect to home page
        if(req.path === '/lobby')
            res.redirect('/');
        else 
            next();
    }
};
