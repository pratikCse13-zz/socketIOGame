var expect = require('chai').expect;
var CONSTANTS = require('./constants.js');
var io = require('socket.io-client');
var socketURL = 'http://localhost:'+CONSTANTS.port;
var _csrf = '';
var cookie = [];

var request = require('request').defaults({jar: true, followRedirect: false});

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var client = io.connect(socketURL, options);

describe('API tests', function(){
	this.timeout(15000);
	it('Homepage API', function(done){
		request.get('http://localhost:6001/', function(err, res, body){
			//console.log(res.headers);
			expect(res.headers['content-type']).to.equals('text/html; charset=UTF-8');
			cookie = res.headers['set-cookie'];
			console.log(_csrf)
			var start = cookie[0].indexOf('=');
			var end = cookie[0].indexOf(';');
			_csrf = cookie[0].substring(start+1, end);
			console.log(_csrf)
			done();
		});
	});

	it('Login API', function(done){
		cookie = request.cookie(cookie[0]);
		//j.setCookie(cookie, 'http://localhost:6001/login');
		request.post('http://localhost:6001/login',{body: {_csrf: _csrf, email: 'pratik@das.das', password: 'sadds'}, json: true}, function (err, res) {
		  	console.log(res.body)
		});
	});
});

/*describe('WebSocket tests', function(){
	it('socket test', function(done){
		client.on('connect', function(data){
			client.emit('getRooms', {});
			console.log('reACHIN')
			client.on('roomList', function(data){
				console.log(data)
				expect(data).to.have.property('errorMsg');
				done();
			});
			done();
		});
	});
});*/