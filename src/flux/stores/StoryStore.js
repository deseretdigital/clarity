var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var StoryStore = function(){
    console.log("BranchStore constructor called");
    /**
    Simple Diffs are summarized and formated on the API side since it cuts down extensively 
    on the network traffic. Extended Diffs are the full response from GitHub
    **/
    this.stories = {};
    
    this._get_promises = {};
};

StoryStore.prototype = merge(EventEmitter.prototype, {
    _get_promises: null,
    get: function(storyId) {
        //console.log("DiffStore#getSimple called", repoName, baseName, headName);
        var self = this;

        if(self.stories[storyId])
        {
            return Promise.resolve(self.stories[storyId]);
        }

        if(self._get_promises[storyId])
        {
            return self._get_promises[storyId];
        }

        self._get_promises[storyId] = request.get('/api/story/' + storyId)
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._get_promises[storyId] = null;
                self.stories[storyId] = resp.body.data;
                self.emitChange();
                return self.stories[storyId];
            });

        return self._get_promises[storyId];
    },

    emitEvent: function(event) {
        this.emit(event);
    },
    emitChange: function() {
        this.emit('CHANGE_EVENT');
    },
    addEventListener: function(event, callback) {
        this.on(event, callback);
    },
    addChangeListener: function(callback) {
        this.on('CHANGE_EVENT', callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener('CHANGE_EVENT', callback);
    },
});
module.exports = new StoryStore();
