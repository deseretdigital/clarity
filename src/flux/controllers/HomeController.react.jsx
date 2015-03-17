var React = require('react');
var Router = require('react-router');
var Promise = require('bluebird');
var RouteHandler = Router.RouteHandler;

var HomeController = React.createClass({
    
    getDefaultProps: function(){
        return {
            
        };
    },
    
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        //PageStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        
        //PageStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return (
            <div id="home">
                
            </div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = HomeController;
