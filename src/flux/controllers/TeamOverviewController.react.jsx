var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Promise = require('bluebird');
var RouteHandler = Router.RouteHandler;

var TeamStore = require('../stores/TeamStore');
var ProjectStore = require('../stores/ProjectStore');


var TeamOverviewController = React.createClass({
    mixins: [Router.State],

    getInitialState: function(){
        return this._getState();
    },

    componentDidMount: function() {
        TeamStore.addChangeListener(this._onChange);
        ProjectStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TeamStore.removeChangeListener(this._onChange);
        ProjectStore.removeChangeListener(this._onChange);
    },
    render: function(){
        var teamName = this.getParams().teamName;
        return (
            <div className="col-md-12">
                <h1>To Be Built, please select a project</h1>
            </div>
        );
    },
    _getState: function(){
        var self = this;

        var state = {
            projects: [],
            team: null
        };

        var teamPromise = TeamStore.get(self._getTeamName());
        if(teamPromise.isFulfilled())
        {
            state.team = teamPromise.value();
        }

        if(state.team)
        {
            _.forEach(state.team.projects, function(projectName){

                var projectPromise = ProjectStore.get(projectName);
                if(projectPromise.isFulfilled())
                {
                    state.projects.push(projectPromise.value());
                }
            });
        }
        return state;
    },
    _onChange: function() {
        this.setState(this._getState());
    },
    _getTeamName: function(){
        return this.getParams().teamName;
    }
});

module.exports = TeamOverviewController;
