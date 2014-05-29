'use strict'

var rules = [];
var mongoose = require('mongoose');
var collection;
var context;
var currentRole;

module.exports = exports = function protector(schema, options) {


    schema.statics.protect = function(req, res, next) {

        context = this;
        currentRole = req;



        return {
            // methods that can be protected

            find: function(args, callback) {

                return _find(args,callback);

            }



        }


    };



    schema.statics.setRules = function(r) {

        collection = this.collection.name;
        rules[collection] = r;

    };


    var _find = function(args,callback) {

        var inRules = (typeof rules[collection] !== "undefined") ? rules[collection] : [];

        var role = (typeof currentRole !== "undefined") ? currentRole : "";

        var localRules = getRulesForRole(inRules, role);

        if (localRules) {
            if (typeof localRules.where !== "undefined") {



                for (var attrn in localRules.where) {
                    args[attrn] = localRules.where[attrn];
                }
            }

            if (localRules.visible.hasOwnProperty('*')) {
                localRules.visible = {};
            }

            if (typeof callback === "function") {



                context.find(args, localRules.visible).where().exec(callback);
            }
            else {
                return context.find(args,  localRules.visible);
            }
        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                return {
                    exec: function(callback) {

                        callback('Unauthorized');
                    }
                }
            }
        }




    };

    schema.statics.findOneProtected = function(args,callback) {


        var inRules = (typeof rules[this.collection.name] !== "undefined") ? rules[this.collection.name] : [];
        var role = (typeof role !== "undefined") ? role : "";

        var localRules = getRulesForRole(inRules, role);

        if (localRules) {
            if (typeof localRules.where !== "undefined") {

                for (var attrn in localRules.where) {
                    args[attrn] = localRules.where[attrn];
                }
            }

            if (typeof callback === "function") {

                this.findOne(args, localRules.visible).where().exec(callback);
            }
            else {
                return this.findOne(args,  localRules.visible);
            }
        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                return {
                    exec: function(callback) {

                        callback('Unauthorized');
                    }
                }
            }
        }




    };

    schema.method('findOneProtected', function() {

    });

    schema.method('saveProtected', function() {

    });





};

function getRulesForRole (rules, roleName) {



    for (var i = 0; i < rules.length; i++)
    {

        if (rules[i].role.name == roleName) {

            return rules[i].role;

        }

    }

    return false;

};

