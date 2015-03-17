var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var ReleaseStore = function(){
    console.log("ReleaseStore constructor called");
    this.releases = {};
    this._getAll_promises = {};
};

ReleaseStore.prototype = merge(EventEmitter.prototype, {
    get: function(repoName, releaseName) {
        //console.log("ReleaseStore#get called, releaseName:" + releaseName);
        var self = this;
        return this.getAll(repoName)
            .then(function(allReleases){
                var foundRelease = null;
                _.forEach(allReleases, function(release){
                    if(release.tag_name == name)
                    {
                        foundRelease = release;
                    }
                });
                
                return foundRelease;
            });
    },
    getLatest: function(repoName){
        var self = this;

        if(!self.releases[repoName])
        {
            self.releases[repoName] = [];
        }

        if(self.releases[repoName].length > 0)
        {
            return Promise.resolve(self.releases[repoName][0]);
        }

        return this.getAll(repoName)
            .then(function(allReleases){
                //console.log("ReleaseStore#getLatest self.releases[" + repoName + "]", self.releases[repoName][0]);
                return self.releases[repoName][0];
            });
    },
    getAll: function(repoName) {
        //console.log('ProjectStore#getAll Called');
        var self = this;
        if(!self.releases[repoName])
        {
            self.releases[repoName] = [];
        }

        if(self.releases[repoName].length > 0)
        {
            return Promise.resolve(self.releases[repoName]);
        }

        // If we're already in the middle of a getAll call, return that promise
        if(self._getAll_promises[repoName])
        {
            console.log("Already running request, here is the promise found: ", self._getAll_promises[repoName]);
            return self._getAll_promises[repoName];
        }

        self._getAll_promises[repoName] = request
            .get('/api/repo/' + repoName + '/releases')
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._getAll_promises[repoName] = null;
                self.releases[repoName] = resp.body.data;
                self.emitChange();
                return self.releases[repoName];
            });

        return self._getAll_promises[repoName];
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
module.exports = new ReleaseStore();
