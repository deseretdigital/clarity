var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var PullReqsHeader = React.createClass({
    getDefaultProps: function(){
        return {
            pullReqsCount: 0
        };
    },
    render: function(){
        var self = this;

        return (
            <div>
                <h2 className="content-subhead">Open Pull Requests: {this.props.pullReqsCount}</h2>
            </div>
        );
    },
});

module.exports = PullReqsHeader;
