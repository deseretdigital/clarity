var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');

var StoryStore = require('../stores/StoryStore');

var StoryActions = function(){
    
};

StoryActions.prototype = merge(EventEmitter.prototype, {
    addLabel: function(storyId, projectId, label){
        return StoryStore.addLabel(storyId, projectId, label);
    }
});
module.exports = new StoryActions();
