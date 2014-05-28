'use strict'

var protectorConfig;
var mongoose = require('mongoose');

exports.protector = function(schema, options) {



    schema.statics.findProtected = function(args, callback) {

        this.find(query, 'status').exec(callback);


//        var mod = mongoose.model(schema.modelName);
//
//        mod.find({}, function(err, data) {
//              callback(err, data);
//        });



    };

    schema.method('findByIdProtected', function() {

    });

    schema.method('findOneProtected', function() {

    });

    schema.method('saveProtected', function() {

    });


};

exports.getConfig = function() {

    console.log(protectorConfig);
};

exports.setConfig = function(config) {
    protectorConfig = config;
};



