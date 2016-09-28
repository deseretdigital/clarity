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
    getDefaultProps: function () {
        return {
            context: 'PULL_REQUEST',
            data: { name: '', estimate: null },
            displayMode: 'standard'
        }
    },
    render: function () {
        const { name, estimate } = typeof this.props.data === 'object' ? this.props.data : {};
        return (
          <tr>
            <td className="story__title">
                <a href={"https://www.pivotaltracker.com/story/show/" + this.props.id} target="_blank">#{this.props.id}</a>
            </td>
            <td>
                {name}
            </td>
            <td>
                {estimate}
            </td>
          </tr>
        );
    },
});

module.exports = StoryItem;
