const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


var ParticipantSchema = new Schema({
        participantId : {type: String, index :{unique:true}},
        email       : {type: String, required: true, index: {unique:true},match: /.+@.+\..+/,lowercase : true},
		firstName   : {type: String, required:true},
		lastName    : {type: String, required:true},
		password    : {type: String, required: true, select:false},		
		role        : {type: String, required: true},		
		department  : {type: String, required: true},		
		salary      : {type: String, required: true},		
		lastvisit   : {type: String, required: true},		
		balanceDue  : {type: String, required: true},		
		enrollSecret: {type: String, required: true, index :{unique:true}},		
		networkName : {type: String, required: true}                  
    });

    ParticipantSchema.pre('save', function(next) {
		var user = this;
		if(!user.isModified('password'))
			return next();
		bcrypt.hash(user.password,null,null,(err,hash) => {
			if(err)
				return next(err);
				user.password = hash;
			next();
		});
	});

module.exports = mongoose.model('Participant',ParticipantSchema);