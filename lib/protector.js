'use strict'

var rules = [];
var mongoose = require('mongoose');
var colors = require('colors');
// var collection;
// var context;
// var currentRole;
// var protectFilter;

colors.setTheme({

    warn: 'yellow'

});

module.exports = exports = function protector(schema, options) {



    // instance methods
    schema.methods.protect = function protect(req) {

        var currentRole = req;
        var collection = this.collection.name;
        console.log("\n\r mongoose-protector: \n\r DOCUMENT INSTANCE METHODS ARE UNDER DEVELOPMENT. USE AT YOUR OWN RISK. \n\r".warn);


        var caller = this;

//        if (typeof caller.role !== "undefined") {
//
//            caller.invalidate('role', 'You do not have permission to write property');
//        } else {
//            console.log("caller role ", caller.role);
//        }

        /**
         *  FYI, THE FOLLOWING SECTION WAS A QUICK HACK TO GET SOMETHING WORKING
         *  I'LL MAKE THIS NICE AND PRETTY AND REFACTORED SHORTLY.
         *
         */
        return {
            save: function(args) {
                // this is a new document, does the user have create permission?
                if (caller.isNew) {

                    var inRules = (typeof rules[collection] !== "undefined") ? rules[collection] : [];

                    var role = (typeof currentRole !== "undefined") ? currentRole : "";

                    var localRules = getRulesForRoleForMethod(inRules, role, 'create');

                    if (localRules) {

                        caller.save(args);

                    } else {
                        if ("function" == typeof args) {
                            args("Unauthorized");
                        } else {
                            throw new mongoose.Error("Unauthorized");
                        }
                    }

                }
                // this document is being updated, does the user have update permission?
                else {

                    var inRules = (typeof rules[collection] !== "undefined") ? rules[collection] : [];

                    var role = (typeof currentRole !== "undefined") ? currentRole : "";

                    var localRules = getRulesForRoleForMethod(inRules, role, 'update');

                    if (localRules) {

                        caller.save(args);

                    } else {

                        if ("function" == typeof args) {
                            args("Unauthorized");
                        } else {
                            throw new mongoose.Error("Unauthorized");
                        }

                    }

                }

            }
        }

    };


    schema.statics.protect = function(req, _protectFilter) {

        var context = this;
        var currentRole = req;
        var collection = this.collection.name;
        var protectFilter = _protectFilter;

        return {

            find: function(args, callback) {

                return _find(args,callback, context, currentRole, collection, protectFilter);

            },
            findOne: function(args, callback) {

                return _findOne(args, callback);

            },
            save: function(fn) {
                console.log('here');
                return true;
            }



        }


    };



    schema.statics.setRules = function(r) {

        rules[this.collection.name] = r;

    };

    function checkDynamic(val) {

        if (typeof val === "string") {
            var spli = val.split('.');

            if (spli[0] === "$dynamic") {
                return [spli[1]];

            }
        }

        return false;

    }


    var _save = function(callback) {


    };


    var _find = function(args,callback, context, currentRole, collection, protectFilter) {
        var inRules = rules[collection]// (typeof rules[collection] !== "undefined") ? rules[collection] : [];

        var role = (typeof currentRole !== "undefined") ? currentRole : "";

        var localRules = getRulesForRoleForMethod(inRules, role, 'read');


        if (localRules) {

            if (typeof localRules.where !== "undefined") {

                for (var attrn in localRules.where) {

                    if (localRules.where[attrn].hasOwnProperty('$in')) {
                        var inArray = localRules.where[attrn]['$in'];
                        var projectionArray = [];
                        inArray.forEach(function(val) {


                            var theKey = checkDynamic(val);
                            if (theKey && protectFilter.hasOwnProperty(theKey)) {
                                projectionArray.push(protectFilter[theKey]);
                            }



                        });

                        if (projectionArray.length > 0) {
                            localRules.where[attrn]['$in'] = projectionArray;
                        }
                    } else {

                        var key = checkDynamic(localRules.where[attrn]);
                        if (key && protectFilter.hasOwnProperty(key)) {
                            localRules.where[attrn] = protectFilter[key];

                        }


                    }

                    args[attrn] = localRules.where[attrn];


                }
            }
            if (localRules.properties.hasOwnProperty('*')) {
                localRules.properties = {};
            }
            if (typeof callback === "function") {



                context.find(args, localRules.properties).where().exec(callback);
            }
            else {
                return context.find(args,  localRules.properties);
            }
        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                // this is pretty hacky
                return {
                    populate: function(args) {
                        return {
                            exec: function(callback) {
                                callback('Unauthorized');
                            }
                        }
                    },
                    exec: function(callback) {

                        callback('Unauthorized');
                    }
                }

            }
        }




    };

    var _findOne = function(args,callback) {


        var inRules = (typeof rules[collection] !== "undefined") ? rules[collection] : [];

        var role = (typeof currentRole !== "undefined") ? currentRole : "";

        var localRules = getRulesForRoleForMethod(inRules, role, 'read');

        if (localRules) {

            if (typeof localRules.where !== "undefined") {

                for (var attrn in localRules.where) {

                    if (localRules.where[attrn].hasOwnProperty('$in')) {
                        var inArray = localRules.where[attrn]['$in'];
                        var projectionArray = [];
                        inArray.forEach(function(val) {


                            var theKey = checkDynamic(val);
                            if (theKey && protectFilter.hasOwnProperty(theKey)) {
                                projectionArray.push(protectFilter[theKey]);
                            }



                        });

                        if (projectionArray.length > 0) {
                            localRules.where[attrn]['$in'] = projectionArray;
                        }
                    } else {

                        var key = checkDynamic(localRules.where[attrn]);
                        if (key && protectFilter.hasOwnProperty(key)) {
                            localRules.where[attrn] = protectFilter[key];

                        }


                    }

                    args[attrn] = localRules.where[attrn];


                }
            }
            if (localRules.properties.hasOwnProperty('*')) {
                localRules.properties = {};
            }
            if (typeof callback === "function") {



                context.findOne(args, localRules.properties).where().exec(callback);
            }
            else {
                return context.findOne(args,  localRules.properties);
            }
        } else {

            if (typeof callback === "function") {

                callback('Unauthorized');

            } else {
                // this is pretty hacky
                return {
                    populate: function(args) {
                        return {
                            exec: function(callback) {
                                callback('Unauthorized');
                            }
                        }
                    },
                    exec: function(callback) {

                        callback('Unauthorized');
                    }
                }

            }
        }
    };




}; //end export

function getRulesForRoleForMethod (rules, roleName, method) {



    for (var i = 0; i < rules.length; i++)
    {

        if (rules[i].role.name == roleName) {


            if (typeof rules[i].role.allow !== "undefined") {

                if (rules[i].role.allow.hasOwnProperty("*")) {

                    return {properties: {}, where: {}};

                } else if (rules[i].role.allow.hasOwnProperty(method)) {

                    return rules[i].role.allow[method];

                }


            }


        }

    }

    return false;

};

