var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var ReleaseListItem = require('./ReleaseListItem.react');

var ReleaseList = React.createClass({
    
    getDefaultProps: function(){
        return {
            releases: {},
            stories: ""
        };
    },
    
    getInitialState: function() {
        return {};
    },
    render: function(){
        var self = this;

        var htmlReleases = _.map(this.props.releases, function(release){
            return <ReleaseListItem release={release} stories={self.props.stories} />
        });

        

        return (
            <div>
                <h2 className="content-subhead">Release History</h2>
                {htmlReleases} 
            </div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = ReleaseList;