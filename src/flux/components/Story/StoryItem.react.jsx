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
        var self = this;

        // console.log("StoryItem#render this.props", this.props);

        var classes = {
            story: true
        };
        var title = 'Loading';
        var state = '';
        var strLabels = '';
        var qaBar = '';
        var project = ''; // Pivotal Project ID

        if (this.props.data && this.props.data.id) {
            title = this.props.data.name;
            state = this.props.data.current_state;
            project = this.props.data.project_id;

            var labels = self._getLabels(this.props.data.labels);
            var strLabels = labels.join(', ');

            _.forEach(labels, function (label) {
                classes[self._slugify(label)] = true;
            });

            classes['state-' + state] = true;
        }
        var labelsHtml = (
                <div></div>
        );
        if (strLabels !== '') {
            labelsHtml = (
                    <p className="story__labels">
                        <strong>Labels:</strong>
                {strLabels}</p>
            );
        }
        if(this.props.displayMode === 'standard') {
            return (
                <div className={classNames(classes)}>
                    <div className="story__header">
                        <div className="story__title">[<a href={"https://www.pivotaltracker.com/story/show/" + this.props.id} target="_blank">#{this.props.id}</a>] {title}</div>
                        <div className="story__state">{state}</div>
                    </div>
                    <div className="story__main">
                        {labelsHtml}
                    </div>
                    <StoryQaBar context={this.props.context} id={this.props.id} labels={labels} project={project} storyState={state}/>
                </div>
            );
        } else if(this.props.displayMode === 'release_notes') {
            return (
                <div className="story__title">[<a href={"https://www.pivotaltracker.com/story/show/" + this.props.id} target="_blank">#{this.props.id}</a>] {title}</div>
            );
        }
    },
});

module.exports = StoryItem;
