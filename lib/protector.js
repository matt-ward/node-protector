'use strict'

var rules = [];
var mongoose = require('mongoose');
var collection;
var context;
var currentRole;
var protectFilter;

module.exports = exports = function protector(schema, options) {


    schema.statics.protect = function(req, _protectFilter) {

        context = this;
        currentRole = req;

        protectFilter = _protectFilter;

        return {

            find: function(args, callback) {

                return _find(args,callback);

            },
            findOne: function(args, callback) {

                return _findOne(args, callback);

            }



        }


    };



    schema.statics.setRules = function(r) {

        collection = this.collection.name;
        rules[collection] = r;

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


    var _find = function(args,callback) {

        var inRules = (typeof rules[collection] !== "undefined") ? rules[collection] : [];

        var role = (typeof currentRole !== "undefined") ? currentRole : "";

        var localRules = getRulesForRole(inRules, role);

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
            if (localRules.visible.hasOwnProperty('*')) {
                localRules.visible = {};
            }
            console.log(args);
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

        var localRules = getRulesForRole(inRules, role);

        if (localRules) {

            if (typeof localRules.where !== "undefined") {

                for (var attrn in localRules.where) {

                    if (localRules.where[attrn].hasOwnProperty('$in')) {
                        var inArray = localRules.where[attrn]['$in'];
                        var projectionArray = [];
                        inArray.forEach(function(val) {


                            var theKey = checkDynamic(val);
                            if (theKey) {
                                projectionArray.push(protectFilter[theKey]);
                            }



                        });

                        if (projectionArray.length > 0) {
                            localRules.where[attrn]['$in'] = projectionArray;
                        }
                    } else {

                        var key = checkDynamic(localRules.where[attrn]);
                        if (key) {
                            localRules.where[attrn] = protectFilter[key];

                        }


                    }

                    args[attrn] = localRules.where[attrn];


                }
            }
            if (localRules.visible.hasOwnProperty('*')) {
                localRules.visible = {};
            }
            console.log(args);
            if (typeof callback === "function") {



                context.findOne(args, localRules.visible).where().exec(callback);
            }
            else {
                return context.findOne(args,  localRules.visible);
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

