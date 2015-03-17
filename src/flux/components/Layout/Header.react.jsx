var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var Header = React.createClass({
    
    getDefaultProps: function(){
        return {
            teams: []
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
        console.log("components/Layout/Header.react#render Teams ", this.props.teams);
        var className = "";

        if(this.props.isHome){
            className = "transparentHome";
        }

        return (
            <header className={className}>
                <Link to="home" className="homeLink">Clarity</Link>
                <ul className="">
                    {_.map(this.props.teams, function(team){
                        return <li key={"team-" + team.name} className="pure-menu-item"><Link to="team" params={{teamName: team.name}} className="pure-menu-link">{team.display}</Link></li>;
                    })}
                </ul>
            </header>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = Header;
