var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var request = require('superagent-bluebird-promise');


var ProjectStore = function(){
    console.log("ProjectStore constructor called");
    this.projects = [];
};

ProjectStore.prototype = merge(EventEmitter.prototype, {
    get: function(name) {
        //console.log("ProjectStore#get called, name:" + name);
        var self = this;
        var foundProject = null;
        _.forEach(this.projects, function(project){
            if(project.name == name)
            {
                foundProject = project;
            }
        });

        if(foundProject)
        {
            //console.log("ProjectStore#get found project, returning resolved promise", foundProject);
            return Promise.resolve(foundProject);
        }

        return this.getAll()
            .then(function(allProjects){
                var foundProject = null;
                _.forEach(allProjects, function(project){
                    if(project.name == name)
                    {
                        foundProject = project;
                    }
                });
                
                return foundProject;
            });
    },
    _getAll_promise: null,
    getAll: function() {
        //console.log('ProjectStore#getAll Called');
        var self = this;
        if(_.keys(self.projects).length > 0)
        {
            return Promise.resolve(self.projects);
        }

        // If we're already in the middle of a getAll call, return that promise
        if(self._getAll_promise)
        {
            return self._getAll_promise;
        }

        self._getAll_promise = request
            .get('/api/projects')
            .set({'Accept': 'application/json'})
            .promise()
            .then(function(resp){
                self._getAll_promise = null;
                self.projects = resp.body.data;
                self.emitChange();
                return self.projects;
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
module.exports = new ProjectStore();
