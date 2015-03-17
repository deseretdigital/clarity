var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');
var moment = require('moment');

var StoryItem = require('../../Story/StoryItem.react');

var ReleaseListItem = React.createClass({
    render: function(){
        var self = this;

        /* Releases is a nested collection of each repo's release */
        var releases = this.props.release;

        var storyIds = {};
        var releaseName = '';

        var htmlReleaseDetails = _.map(releases, function(release){
            releaseName = release.tag_name;
            if(release.diff)
            {
                storyIds = _.assign(storyIds, release.diff.storyIds);    
            }

            return (
                <div>
                    <strong>{release.repo}</strong> - 
                    Release Published: {moment(release.published_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                    Last Commit Date: {moment(release.updated_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                </div>
            );
        });

        var htmlStories = _.map(storyIds, function(storyId){
            return <StoryItem id={storyId} data={self.props.stories[storyId]} context={StoryItem.contexts.RELEASE} />;
        });

        return (
            <div className="release">
                <div className="releaseInside">
                    <h3>Release: {releaseName}</h3>
                    <strong>Released:</strong> {} <strong>Last Commit Date:</strong>
                    {htmlStories}
                </div>
            </div>
        );
    }
});

module.exports = ReleaseListItem;