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
    console.log('req.session')
    console.log(req.session) 
    if (req.session && req.session.user) {
        console.log('1')
        models.User.findOne({ email: req.session.user.email }, 'name email', function(err, user) {
            if (user) {
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
            } else {
                  res.redirect('/');
            }
        });
    } else {
        console.log('req.path')
        console.log(req.path) 
        if(req.path === '/lobby')
            res.redirect('/');
        else 
            next();
    }
};
