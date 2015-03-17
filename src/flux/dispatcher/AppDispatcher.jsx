var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var NotFoundRoute = Router.NotFoundRoute;
var Promise = require('bluebird');
var objectAssign = require('object-assign');
var BaseDispatcher = require('./BaseDispatcher');
var merge = require('react/lib/merge');
var AppConstants = require('../constants/AppConstants');
var PayloadSources = AppConstants.PayloadSources;

var NotFoundPage = require('../components/NotFoundPage.react');



var AppDispatcher = function(){
    //console.log('inside AppDispatcher', this.__proto__);
    this.init();
};

AppDispatcher.prototype = objectAssign(BaseDispatcher.prototype, {
    init: function(){
        // Init the base members
        this.baseInit();
    }
});

module.exports = new AppDispatcher();
