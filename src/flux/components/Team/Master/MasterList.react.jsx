var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var StoryItem = require('../../Story/StoryItem.react');
var StoryItemReleaseNotes = require('../../Story/StoryItemReleaseNotes.react');

var MasterList = React.createClass({

    getDefaultProps: function(){
        return {
            masters: {},
            stories: ""
        };
    },

    getInitialState: function() {
        return {};
    },
    render: function(){
        var self = this;

        // State Url
        var htmlStageUrl = '';
        if(this.props.project.stageMasterUrl)
        {
            var stageUrl = this.props.project.stageMasterUrl;
            htmlStageUrl = (
                <div className="stageUrl">Stage:
                    <a href={stageUrl} target="_blank">{stageUrl}</a>
                </div>
            );
        }

        // Get all stories
        var storyIds = {};

        _.forEach(this.props.masters, function(master){
            if(master.diff)
            {
                storyIds = _.assign(storyIds, master.diff.storyIds);
            }
        });

        var htmlStories = _.map(storyIds, function(storyId){
            return <StoryItem id={storyId} data={self.props.stories[storyId]} context={StoryItem.contexts.MASTER} />;
        });
        var htmlStoryNotes = (
            <table>
                {_.map(storyIds, (storyId) => {
                    return (
                        <StoryItemReleaseNotes
                            displayMode="release_notes"
                            id={storyId}
                            key={storyId}
                            data={self.props.stories[storyId]}
                            context={StoryItem.contexts.MASTER}
                        />
                    );
                })}
            </table>
        );

        // Commits
        var htmlCommitStats = _.map(this.props.masters, function(master){
            //console.log("MasterList#render master", master);
            return (
                <div><strong>{master.repo}:</strong> {master.diff.commits.length}</div>
            );
        });

        let branchOptions = _.map(this.props.releaseBranches, (branchName) => {
            return (
                <option value={branchName}>{branchName}</option>
            );
        });



        return (
            <div>
                <div className="branch-selector" style={{ float:'right' }}>
                    <select onChange={this.handleBranchBaseChange}>
                        {branchOptions}
                    </select>
                </div>
                <h2 className="content-subhead">Stories for Release: {_.keys(storyIds).length}</h2>
                <div className="master">
                    <div className="master__main">
                        <h3>Master</h3>
                        {htmlStageUrl}
                        <h3>Commits</h3>
                        {htmlCommitStats}
                        <h3>Stories</h3>
                        {htmlStories}
                    </div>
                    <div className="master__release-notes">
                        <h4>Summary:</h4>
                        {htmlStoryNotes}
                    </div>
                </div>
            </div>
        );
    },

    handleBranchBaseChange: function(event) {
        this.props.handleBranchBaseChange(event.target.value);
    },

    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = MasterList;
