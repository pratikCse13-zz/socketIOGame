var mongoose = require('mongoose');
var CONSTANTS = require('./constants.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var connection = mongoose.createConnection(CONSTANTS.dbUrl);

/**
 * Schema definition of User model
 */
module.exports.User = connection.model('User', new Schema({
  	id:       ObjectId,
  	name:     {type: String, required: 'Name is required.' },
  	email:    {type: String, required: 'Email is required.', unique: true },
  	password: {type: String, required: 'Passowrd is required.' }
}));

module.exports.Room = connection.model('Room', new Schema({
  	id:        ObjectId,
  	name:      {type: String, required: 'Name is required.' },
  	password:  {type: String, required: 'Passowrd is required.' },
  	owner:     {type: ObjectId, required: 'Unauthenticated Creation.', unique: true },
  	ownerName: {type: String, required: 'Unauthenticated Creation.' },
  	members:   {type: [ObjectId], required: 'Unauthenticated Creation.' }
}));
