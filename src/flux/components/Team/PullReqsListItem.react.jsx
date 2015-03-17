var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var PullReq = require('./PullReqs/PullReq.react');
var StoryItem = require('../Story/StoryItem.react');

var PullReqsListItem = React.createClass({
    
    getDefaultProps: function(){
        return {
            pullReqData: {},
            pullReqName: ""
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
        var pullReqData = this.props.pullReqData;

        if(_.size(pullReqData) <= 0)
        {
            return <div>Pull Request Data Missing</div>;
        }

        /* Set Variables */
        var pullReqName = this.props.pullReqName;
        var htmlStageUrl = "";
        if(this.props.project && this.props.project.stageUrlPrefix)
        {
            var stageUrl = this.props.project.stageUrlPrefix + pullReqName + this.props.project.stageUrlPostfix
            htmlStageUrl = (
                <div className="stageUrl">
                    Stage: <a href={stageUrl} target="_blank">{stageUrl}</a>
                </div>
            );
        }

        var storyIds = {};

        var htmlPullReqs = _.map(this.props.pullReqData, function(pullReq){
            storyIds = _.assign(storyIds, pullReq.storyIds);

            if(pullReq.diff)
            {
                storyIds = _.assign(storyIds, pullReq.diff.storyIds);
            }

            return <PullReq pullReq={pullReq} aheadBehindStats={self.props.aheadBehindStats} />;
        });

        var htmlStories = _.map(storyIds, function(storyId){
            return <StoryItem id={storyId} data={self.props.stories[storyId]}  context={StoryItem.contexts.PULL_REQUEST}/>;
        });

        return (
            <div className="pullRequest">
                <div className="prInside">
                    <h3>{pullReqName}</h3>
                    {htmlStageUrl}
                    {htmlPullReqs}
                    {htmlStories}
                </div>
            </div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = PullReqsListItem;