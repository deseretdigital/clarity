var React = require('react');
var objectAssign = require('object-assign');
var ActionTypes = require('../constants/AppConstants').ActionTypes;

var AppActions = function(dispatcher){
    this.dispatcher = dispatcher;
};

AppActions.prototype = objectAssign(AppActions.prototype, {
    pageLoaded: function() {
        return AppDispatcher.handleAction({
            type: ActionTypes.CONTROLLER_LOADED,
        });
    }
});

module.exports = AppActions;
