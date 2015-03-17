var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var TeamStore = function(){
    console.log("TeamStore constructor called");
    this.teams = [];
};

TeamStore.prototype = merge(EventEmitter.prototype, {
    get: function(name) {
        //console.log("TeamStore#get called, name:" + name);
        var self = this;
        var foundTeam = null;
        _.forEach(this.teams, function(team){
            if(team.name == name)
            {
                foundTeam = team;
            }
        });

        if(foundTeam)
        {
            //console.log("TeamStore#get found project, returning resolved promise");
            return Promise.resolve(foundTeam);
        }

        return this.getAll()
            .then(function(allTeams){
                var foundTeam = null;
                _.forEach(allTeams, function(team){
                    if(team.name == name)
                    {
                        foundTeam = team;
                    }
                });
                
                return foundTeam;
            });
    },

    _getAll_promise: null,
    getAll: function() {
        var self = this;
        //console.log('TeamStore#getAll Called');
        var self = this;
        if(_.keys(self.teams).length > 0)
        {
            return Promise.resolve(self.teams);
        }

        if(self._getAll_promise)
        {
            return self._getAll_promise;
        }

        self._getAll_promise = request
            .get('/api/teams')
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._getAll_promise = null;
                
                self.teams = resp.body.data;
                self.emitChange();
                return self.teams;
            });

        return self._getAll_promise;
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
module.exports = new TeamStore();
