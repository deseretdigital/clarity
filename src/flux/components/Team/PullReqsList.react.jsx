var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var PullReqsListItem = require('./PullReqsListItem.react');

var PullReqsList = React.createClass({
    
    getDefaultProps: function(){
        return {
            pullReqs: {},
            project: null,
            stories: {}
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
        console.log("components/Team/PullReqsList.react#render this.props ", this.props);

        var htmlPullReqs = [];

        var aheadBehindStats = self._generateAheadBehindStats(this.props.pullReqs);

        _.forOwn(this.props.pullReqs, function(pullReqData, pullReqName){
            var html = (
                <PullReqsListItem 
                    pullReqData={pullReqData} 
                    pullReqName={pullReqName} 
                    project={self.props.project}
                    aheadBehindStats={aheadBehindStats}
                    stories={self.props.stories} />
            );

            htmlPullReqs.push(html); 
        });

        return (
            <div id="pullRequests">
                {htmlPullReqs}
            </div>
        );
    },
    _generateAheadBehindStats: function(pullReqs){
        var mostAhead = 25;
        var mostBehind = 25;
        _.forEach(pullReqs, function(branchPullReqs){
            _.forEach(branchPullReqs, function(pullReq){
                if(pullReq.diff)
                {
                    if(pullReq.diff.aheadBy > mostAhead)
                    {
                        mostAhead = pullReq.diff.aheadBy;
                    }

                    if(pullReq.diff.behindBy > mostBehind)
                    {
                        mostBehind = pullReq.diff.behindBy;
                    }
                }
            });
        });


        return {
            mostAhead: mostAhead,
            mostBehind: mostBehind
        }
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = PullReqsList;