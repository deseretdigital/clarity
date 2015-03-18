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

    /**
     * We want to allow grabbing out of the cache directly because
     * get(storyId) will kick off a request if it doesn't exist.
     * However, many requests go through getMany, so we don't
     * want to duplicate requesting the data.
     */
    getCached: function(storyId){
        if(this.stories[storyId])
        {
            return this.stories[storyId];
        }

        return null;
    },

    getMany: function(storyIds){
        var self = this;

        // Get only ones we haven't cached yet.
        var neededStoryIds = _.filter(storyIds, function(storyId){
            return !self.stories[storyId];
        }).map(function(storyId){
            return storyId;
        });

        if(neededStoryIds.length <= 0)
        {
            return Promise.resolve(self.getManyCached(storyIds));
        }

        return request.post('/api/story/bulk-retrieve')
            .send({storyIds: neededStoryIds})
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                var stories = resp.body.data;
                
                // Store Stories in cache
                _.forEach(stories, function(story){
                    self.stories[story.id] = story;
                });

                return self.getManyCached(storyIds);
            });
    },

    getManyCached: function(storyIds)
    {
        // Get all story objects and return them, chaching!
        var returnStories = {};

        _.forEach(storyIds, function(storyId){
            returnStories[storyId] = self.stories[storyId];
        });

        return returnStories;
    },

    addLabel: function(storyId, projectId, label){
        var self = this;

        return request.post('/api/story/' + storyId + '/add-label')
            .send({project: projectId, label: label})
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self.stories[storyId] = null; // clear local cache
                
                // Don't emit just yet, let the get action emit and force an update.
                //self.emitChange();
                
                // return promise of when the new one should be loaded
                return self.get(storyId);
            });
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
