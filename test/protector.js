var should = require('chai').should()
    , protector = require('../lib/protector');

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;



var fakeSchema =  {


    save: function() {
      return;
    },
    find: function() {

    },

    findById: function() {

    },

    findOne: function() {

    },

    method: function(s, func) {

       this[s] = func;

    }
};


describe('#protect', function() {
    console.log(fakeSchema);
    protector.protector(fakeSchema);
    protector.getConfig();

    console.log(fakeSchema);

    fakeSchema.protectedFind(query).sanitize();



});
