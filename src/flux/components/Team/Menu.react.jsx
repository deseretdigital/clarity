var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var Header = React.createClass({
    
    getDefaultProps: function(){
        return {
            teamName: '',
            teams: [],
            projects: []
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
        var self = this;
        console.log("components/Team/Menu.react#render this.props ", this.props);

        return (
            <div id="menu">
                <div className="pure-menu pure-menu-open">
                    <a className="pure-menu-heading" href="#">Team Menu</a>
                    <ul>
                        <li><Link to="team-overview" params={ {teamName: this.props.teamName} }>Overview</Link></li>
                    </ul>
                    <a className="pure-menu-heading" href="#">Projects</a>
                    <ul>
                        {_.map(this.props.projects, function(project){
                            return (
                                <li key={"team-" + self.props.teamName + "-project-" + project.name}><Link to="team-project" 
                                params={{
                                    teamName: self.props.teamName, 
                                    projectName: project.name
                                }}>{project.display}</Link></li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = Header;
