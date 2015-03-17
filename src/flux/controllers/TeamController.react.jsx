var _ = require('lodash');
var React = require('react');
var ReactAsync = require('react-async');
var Router = require('react-router');
var Promise = require('bluebird');
var RouteHandler = Router.RouteHandler;


var TeamStore = require('../stores/TeamStore');
var ProjectStore = require('../stores/ProjectStore');

var TeamMenu = require('../components/Team/Menu.react');

var TeamController = React.createClass({
    mixins: [Router.State, ReactAsync.Mixin],
    
    getInitialStateAsync: function(cb){
        var self = this;
        this.initState = true;
        this._buildState()
            .then(function(state){
                self.initState = false;
                cb(null, state);
            });
    },

    componentDidMount: function() {
        TeamStore.addChangeListener(this._onChange);
        ProjectStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TeamStore.removeChangeListener(this._onChange);
        ProjectStore.removeChangeListener(this._onChange);
    },
    componentWillReceiveProps: function() {
        this._onChange();
    },
    render: function(){
        console.log("TeamController#render this.getParams()", this.getParams());
        console.log("TeamController#render this.state", this.state);
        var teamName = this.getParams().teamName;
        return (
            <div id="layout">
                <TeamMenu teamName={teamName} projects={this.state.projects} />
                <div id="main">
                    <RouteHandler />
                </div>
            </div>
        );
    },
    _buildState: function(){
        var self = this;

        var state = {
            projects: [],
            team: null
        };

        self._buildState_promise = TeamStore.get(self._getTeamName())
            .then(function(team){
                state.team = team;
                return self._buildState_projects(state);
            })
            .then(function(){
                console.log("TeamController#_buildState finished", state);
                return state;
            });

        return self._buildState_promise;
    },
    _buildState_projects: function(state){
        var promises = [];
        _.forEach(state.team.projects, function(projectName){
            var promise = ProjectStore.get(projectName)
                .then(function(project){
                    state.projects.push(project);
                });

            promises.push(promise);
        });

        return Promise.all(promises);
    },

    _onChange: function() {
        var self = this;
        // It is already running init state
        if(this.initState)
        {
            return;
        }

        this._buildState() 
            .then(function(state){
                self.setState(state);
            });
    },
    _getTeamName: function(){
        return this.getParams().teamName;
    }
});

module.exports = TeamController;
