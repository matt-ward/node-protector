'use strict';

var rules = {};
var mongoose = require('mongoose');
var colors = require('colors');
var collection;
var context;
var currentRole;
var protectFilter;

colors.setTheme({

    warn: 'yellow'

});

module.exports = exports = function protector(schema, options) {


    schema.methods.protect = function protect(req) {

        currentRole = req;

        collection = this.collection.name;
        console.log("\n\r mongoose-protector: \n\r DOCUMENT INSTANCE METHODS ARE UNDER DEVELOPMENT. USE AT YOUR OWN RISK. \n\r".warn);

        var caller = this;

        return {
            save: function (args) {

                var inputRules = getRules(collection);

                //On Create
                if (caller.isNew) {

                    var localRules = getRulesForRoleForMethod(inputRules, currentRole, 'create');

                }
                //On Update
                else {

                    var localRules = getRulesForRoleForMethod(inputRules, currentRole, 'update');

                }

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

    };


    schema.statics.protect = function (req, _protectFilter) {

        context = this;
        currentRole = req;
        collection = context.collection.name;
        protectFilter = _protectFilter;

        return {

            find: function (args, callback) {

                return _find(args, callback);

            },
            findOne: function (args, callback) {

                return _findOne(args, callback);

            },

            /**
             * TODO: Not Implemented
             * @param fn
             * @returns {boolean}
             */
            save: function (fn) {

                return _save();
            }


        }


    };


    schema.statics.setRules = function (r) {

        rules[this.collection.name] = r;

    };

    function getRules(collection) {

        return rules[collection];

    }

    function checkDynamic(val) {

        if (typeof val === "string") {
            var spli = val.split('.');

            if (spli[0] === "$dynamic") {
                return [spli[1]];

            }
        }

        return false;

    }


    /**
     * TODO: Not implemented
     * @param callback
     * @returns {boolean}
     * @private
     */
    var _save = function (callback) {

        return true;

    };


    /**
     * Executor for the driver to find or findOne
     * @param queryType
     * @param localRules
     * @param callback
     * @returns {*}
     * @private
     */
    var _findFor = function (queryType, localRules, callback) {


        if (localRules) {

            if (typeof localRules.where !== "undefined") {

                for (var attrn in localRules.where) {

                    if (localRules.where[attrn].hasOwnProperty('$in')) {
                        var inArray = localRules.where[attrn]['$in'];
                        var projectionArray = [];
                        inArray.forEach(function (val) {

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

                if (queryType == "all") {
                    context.find(args, localRules.properties).where().exec(callback);
                } else if (queryType == "one") {
                    context.findOne(args, localRules.properties).where().exec(callback);
                }
            }
            else {
                if (queryType == "all") {
                    return context.find(args, localRules.properties);
                } else if (queryType == "one") {
                    return context.findOne(args, localRules.properties);
                }
            }
        } else {

            if (typeof callback === "function") {

                return callback('Unauthorized');

            } else {
                // this is pretty hacky
                return {
                    populate: function (args) {
                        return {
                            exec: function (callback) {
                                return callback('Unauthorized');
                            }
                        }
                    },
                    exec: function (callback) {

                        return callback('Unauthorized');
                    }
                }

            }
        }


    };


    var _find = function (args, callback) {

        var inRules = getRules(collection);
        var localRules = getRulesForRoleForMethod(inRules, currentRole, 'read');
        return _findFor("all", localRules, callback)


    };

    var _findOne = function (args, callback) {

        var inRules = getRules(collection);
        var localRules = getRulesForRoleForMethod(inRules, currentRole, 'read');
        return _findFor("one", localRules, callback)

    };


}; //end export

function getRulesForRoleForMethod(inputRules, roleName, method) {

    var role = (typeof roleName !== "undefined") ? roleName : "";
    var rules = (typeof inputRules !== "undefined") ? inputRules : [];


    for (var i = 0; i < rules.length; i++) {

        if (rules[i].role.name == role) {


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

}

