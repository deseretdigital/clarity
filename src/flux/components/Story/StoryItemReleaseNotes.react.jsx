var _ = require('lodash');
var React = require('react');
var moment = require('moment');
var classNames = require('classnames');

var StoryQaBar = require('./StoryQaBar.react');

var StoryItem = React.createClass({
    statics: {
        contexts: {
            PULL_REQUEST: 'PULL_REQUEST',
            MASTER: 'MASTER',
            RELEASE: 'RELEASE'
        }
    },
    _slugify: function (text) {
        text = text.replace(/\ /g, '-');
        text = text.replace(/\:/g, '');

        return text;
    },
    _getLabels: function (labelsArr) {
        return _.map(labelsArr, function (label) {
            return label.name;
        });
    },
    getDefaultProps: function () {
        return {
            context: 'PULL_REQUEST',
            displayMode: 'standard'
        }
    },
    render: function () {
        return (
          <tr>
            <td className="story__title">
                <a href={"https://www.pivotaltracker.com/story/show/" + this.props.id} target="_blank">#{this.props.id}</a>
            </td>
            <td>
                {this.props.data.name}
            </td>
            <td>
                {this.props.data.estimate}
            </td>
          </tr>
        );
    },
});

module.exports = StoryItem;
