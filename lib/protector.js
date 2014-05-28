'use strict'

var rules = {};
var mongoose = require('mongoose');

exports.protector = function(schema, options) {



    schema.statics.setRules = function(r) {

        rules[this.collection.name] = r;

    };


    schema.statics.findProtected = function(args,callback) {
        var localRules = rules[this.collection.name];

        if (typeof localRules.where !== "undefined") {
            for (var attrn in localRules.where) {
                args[attrn] = localRules.where[attrn];
            }
        }

        if (typeof callback === "function") {

            this.find(args, localRules.visible).where().exec(callback);
        }
        else {
            return this.find(args,  localRules.visible);
        }




    };

    schema.method('findByIdProtected', function() {

    });

    schema.method('findOneProtected', function() {

    });

    schema.method('saveProtected', function() {

    });





};



