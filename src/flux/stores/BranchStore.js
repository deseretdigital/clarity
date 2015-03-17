var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var BranchStore = function(){
    console.log("BranchStore constructor called");
    this.branches = {};
    this._getAll_promises = {};
};

BranchStore.prototype = merge(EventEmitter.prototype, {
    get: function(repoName, branchName) {
        //console.log("BranchesStore#get called, releaseName:" + releaseName);
        var self = this;

        if(self.branches[repoName])
        {
            var foundBranch = null;
            _.forEach(allBranches, function(branch){
                if(branch.name == name)
                {
                    foundBranch = branch;
                }
            });

            return Promise.resolve(foundBranch);
        }

        return this.getAll(repoName)
            .then(function(allBranches){
                var foundBranch = null;
                _.forEach(allBranches, function(branch){
                    if(branch.name == name)
                    {
                        foundBranch = branch;
                    }
                });
                
                return foundBranch;
            });
    },
    getAll: function(repoName) {
        //console.log('BranchStore#getAll Called');
        var self = this;
        if(self.branches[repoName])
        {
            return Promise.resolve(self.branches[repoName]);
        }

        // If we're already in the middle of a getAll call, return that promise
        if(self._getAll_promises[repoName])
        {
            //console.log("Already running request, here is the promise found: ", self._getAll_promises[repoName]);
            return self._getAll_promises[repoName];
        }

        self._getAll_promises[repoName] = request
            .get('/api/repo/' + repoName + '/branches')
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._getAll_promises[repoName] = null;
                self.branches[repoName] = resp.body.data;
                self.emitChange();
                return self.branches[repoName];
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
module.exports = new BranchStore();
