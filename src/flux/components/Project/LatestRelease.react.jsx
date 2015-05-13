var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');
var Moment = require('moment');

var LatestRelease = React.createClass({

    getDefaultProps: function(){
        return {
            releases: []
        };
    },

    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
    },
    render: function(){
        var self = this;
        // console.log("components/Project/LatestRelease.react#render this.props ", this.props);

        if(this.props.releases.length <= 0){
            return <h2>Loading Releases</h2>;
        }

        var htmlReleases = _.map(this.props.releases, function(release){
            var fromNowStr = Moment(release.published_at).fromNow();
            var whenStr = Moment(release.published_at).format('MM-DD-YYYY');
            return (
                <p className="project-release">
                    <strong>{release.repo}</strong>: {release.tag_name} - {fromNowStr} ({whenStr})
                </p>
            );
        });

        return (
            <div className="team-project__latest-releases">
                <h2>Latest Releases</h2>
                {htmlReleases}
            </div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = LatestRelease;
