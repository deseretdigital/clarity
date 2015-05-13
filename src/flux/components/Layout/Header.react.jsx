var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var classNames = require('classnames');

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
        var classes = {
            'header': true,
            'header--transparent': this.props.isHome,
        };

        return (
            <header className={classNames(classes)}>
                <Link to="home" className="header__home-link">Clarity</Link>
                <ul className="teams-list">
                    {_.map(this.props.teams, function(team){
                        return <li key={"team-" + team.name} className="teams-list__item"><Link to="team" params={{teamName: team.name}} className="pure-menu-link">{team.display}</Link></li>;
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
