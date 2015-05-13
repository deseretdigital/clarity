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
    render: function(){
        var self = this;
        // console.log("components/Team/Menu.react#render this.props ", this.props);

        return (
            <div className="team-menu">
                <div className="menu">
                    <div className="menu__title">Team Menu</div>
                    <ul>
                        <li className="menu__item"><Link to="team-overview" params={ {teamName: this.props.teamName} }>Overview</Link></li>
                    </ul>
                </div>
                <div className="menu">
                    <div className="menu__title">Projects</div>
                    <ul>
                        {_.map(this.props.projects, function(project){
                            return (
                                <li
                                    className="menu__item"
                                    key={"team-" + self.props.teamName + "-project-" + project.name}>
                                    <Link to="team-project"
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
