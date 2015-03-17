var _ = require('lodash');
var React = require('react');
var moment = require('moment');

var StoryQaBar = React.createClass({
  statics: {
    contexts: {
      PULL_REQUEST: 'PULL_REQUEST',
      MASTER: 'MASTER',
      RELEASE: 'RELEASE'
    }
  },
  _slugify: function(text){
    text = text.replace(/\ /g, '-');
    text = text.replace(/\:/g, '');
    return text;
  },
  _getLabels: function(labelsArr){
    return _.map(labelsArr, function(label){
      return label.name;
    });
  },
  getDefaultProps: function(){
    return {
      context: 'PULL_REQUEST'
    }
  },
  render: function(){
    var self = this;

    var sluggedLabels = _.map(this.props.labels, function(label){
        return self._slugify(label);
    })

    /* QA Status */
    var qaMessage = '';
    var qaClass = '';
    var qaButton = '';
    var qaLabel = '';

    if(this.props.context == 'PULL_REQUEST')
    {
        qaLabel = 'qa-done-branch';
    }
    else if (this.props.context == 'MASTER')
    {
        qaLabel = 'qa-done-master';
    }
    else if (this.props.context == 'RELEASE')
    {
        qaLabel = 'qa-done-www';
    }

    if(_.indexOf(sluggedLabels, 'no-qa') >= 0){
        qaMessage = 'no-qa - QA Not Possible for this story';
        qaClass = 'qaNeutral';
    }   
    else if(this.props.storyState == 'accepted')
    {
        
        if(_.indexOf(sluggedLabels, qaLabel) < 0){
            qaMessage = 'missing ' + qaLabel + ' - QA required for this story!';
            qaClass = 'qaAttention';
            qaButton = (
                <button className="pure-button button-success addLabel" dataLabel={qaLabel} dataStory={this.props.id}>Accept QA</button>
            );
        }
        else
        {
            qaMessage = 'found ' + qaLabel + ' - QA has been completed for this stage';
            qaClass = 'qaDone';
        }
    }

    if(qaMessage.length <= 0)
    {
        qaMessage = 'No QA Step Required Currently';
        qaClass = 'qaNeutral';
    }
    
    return (
        <div className={"qaStatus " + qaClass }>
            <div className="qaMessage"><strong>QA:</strong> {qaMessage}</div>
            {qaButton}
        </div>
      
    );
  }
});

module.exports = StoryQaBar;