var React = require('react');
var ReactAsync = require('react-async');
var Router = require('react-router');
var Promise = require('bluebird');
var RouteHandler = Router.RouteHandler;
var moment = require('moment');

var TeamStore = require('../stores/TeamStore');

var Header = require('../components/Layout/Header.react');

function getImage() {
    if(moment().format('MM-DD') == '04-01')
    {
        return 'april-fools';
    }

    return moment().format('E');
};

var AppController = React.createClass({
    mixins: [ Router.State, ReactAsync.Mixin ],
    

    getDefaultProps: function(){
        return {
            randomImage:  getImage()
        };
    },
    
    /* getInitialState: function() {
        var state = this._buildState();
        return state;
    }, */

    getInitialStateAsync: function(cb){
        var state = {
            teams: {}
        };

        console.log("-----------------------------------------------------------");
        console.log("getInitialStateAsync Called");
        console.log("-----------------------------------------------------------");

        TeamStore.getAll()
            .then(function(allTeams){
                state.teams = allTeams;
                console.log("-----------------------------------------------------------");
                console.log("AppController#getInitialStateAsync returning state", state);
                console.log("-----------------------------------------------------------");
                cb(null, state);
            });
    },
    componentDidMount: function() {
        TeamStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        
        TeamStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return (
            <div id="app" style={{backgroundImage: "url(/img/clarity-bg-" + this.props.randomImage + ".jpg)"}}>
                <Header teams={this.state.teams} />
                <RouteHandler />
            </div>
        );
    },
    _buildState: function(){
        var state = {
            teams: {}
        };

        var teamPromise = TeamStore.getAll();
        if(teamPromise.isFulfilled())
        {
            state.teams = teamPromise.value();
        }

        return state;
    },
    _onChange: function() {
        //this.setState(this._buildState());
    }
});

module.exports = AppController;
