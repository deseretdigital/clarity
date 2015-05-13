var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var PullReqStore = function(){
    // console.log("BranchStore constructor called");
    this.pullReqs = {};
    this._getAll_promises = {};
};

PullReqStore.prototype = merge(EventEmitter.prototype, {
    _getAll_promises: {},
    getAll: function(repoName) {
        //console.log('BranchStore#getAll Called');
        var self = this;

        if(self.pullReqs[repoName])
        {
            return Promise.resolve(self.pullReqs[repoName]);
        }

        // If we're already in the middle of a getAll call, return that promise
        if(self._getAll_promises[repoName])
        {
            //console.log("Already running request, here is the promise found: ", self._getAll_promises[repoName]);
            return self._getAll_promises[repoName];
        }

        self._getAll_promises[repoName] = request
            .get('/api/repo/' + repoName + '/pull-requests')
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._getAll_promises[repoName] = null;
                self.pullReqs[repoName] = resp.body.data;
                self.emitChange();
                return self.pullReqs[repoName];
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
module.exports = new PullReqStore();
