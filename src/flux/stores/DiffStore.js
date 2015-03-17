var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var DiffStore = function(){
    console.log("BranchStore constructor called");
    /**
    Simple Diffs are summarized and formated on the API side since it cuts down extensively 
    on the network traffic. Extended Diffs are the full response from GitHub
    **/
    this.simpleDiffs = {};
    this.extendedDiffs = {};
    this._getAll_promises = {};
};

DiffStore.prototype = merge(EventEmitter.prototype, {
    _getSimple_promises: {},
    getSimple: function(repoName, baseName, headName) {
        //console.log("DiffStore#getSimple called", repoName, baseName, headName);
        var self = this;

        var diffName = self.getDiffName(baseName, headName);

        if(self.simpleDiffs[repoName] && self.simpleDiffs[repoName][diffName])
        {
            return Promise.resolve(self.simpleDiffs[repoName][diffName]);
        }
        else if(!self.simpleDiffs[repoName])
        {
            self.simpleDiffs[repoName] = {};
        }

        if(self._getSimple_promises[repoName] && self._getSimple_promises[repoName][diffName])
        {
            return self._getSimple_promises[repoName][diffName];
        }
        else if(!self._getSimple_promises[repoName]){
            self._getSimple_promises[repoName] = {};
        }

        self._getSimple_promises[repoName][diffName] = request.get('/api/repo/' + repoName + '/diff/' + baseName + '/' + headName + '?simple=1')
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._getSimple_promises[repoName][diffName] = null;
                self.simpleDiffs[repoName][diffName] = resp.body.data;
                self.emitChange();
                return self.simpleDiffs[repoName][diffName];
            })
            .catch(function(err){
                console.error(err);
                self._getSimple_promises[repoName][diffName] = null;
                self.emitChange();
            });

        return self._getSimple_promises[repoName][diffName];
    },

    getDiffName: function(baseName, headName){
        return baseName + "__" + headName;
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
module.exports = new DiffStore();
