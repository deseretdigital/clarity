var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var RepoStore = function(){
    console.log("ProjectStore constructor called");
    this.repos = {};
};

RepoStore.prototype = merge(EventEmitter.prototype, {
    _get_promises: {},
    get: function(repoName) {
        //console.log("RepoStore#get called, repoName:" + repoName);
        var self = this;
        
        if(self.repos[repoName])
        {
            return Promise.resolve(self.repos[repoName]);
        }

        if(self._get_promises[repoName])
        {
            return self._get_promises[repoName];
        }

        self._get_promises[repoName] = request.get('/api/repo/' + repoName)
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._get_promises[repoName] = null;
                self.repos[repoName] = resp.body.data;
                self.emitChange();

                return self.repos[repoName];
            });

        return self._get_promises[repoName];
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
module.exports = new RepoStore();
