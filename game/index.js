var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var CONSTANTS = require('./constants.js');
var expressHbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var rooms = require('./routes/room.js');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

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

var session = require('express-session')({
    secret: CONSTANTS.sessionSecretKey,
    resave: false,
    saveUninitialized: false,
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
var sharedSession = require("express-socket.io-session");

app.use(morgan('dev'));

app.use(session);

io.use(sharedSession(session, {
  autoSave: true
}));

app.use('/', rooms);

app.listen(process.env.PORT || CONSTANTS.port,function(){
  console.log('server listening at port '+ (process.env.PORT || CONSTANTS.port));
});