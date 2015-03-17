var _ = require('lodash');
var React = require('react');
var moment = require('moment');

var StoryItem = React.createClass({
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
  render: function(){
    var self = this;

    console.log("StoryItem#render this.props", this.props);

    var classes = ['story'];
    var title = 'Loading';
    var state = '';
    var strLabels = '';
    var qaBar = '';

    if(this.props.data && this.props.data.id)
    {
      title = this.props.data.name;
      state = this.props.data.current_state;
      var labels = self._getLabels(this.props.labels);
      var strLabels = labels.join(', ');

      _.forEach(labels, function(label){
        classes.push('label-' + self._slugify(label));
      });

      classes.push('state-' + state);

    }

    return (
      <div className={classes.join(' ')}>
        <div className="storyInside">
          <div className="state">{state}</div>
          <h4 className="title">[<a href={"https://www.pivotaltracker.com/story/show/" + this.props.id} target="_blank">#{this.props.id}</a>] {title}</h4>
          <div className="labels"><strong>Labels:</strong> {strLabels}</div>
        </div>
        <div className="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story! <button className="pure-button button-success addLabel" data-label="qa-done-master" data-story="85086626">Accept QA</button></div>
      </div>
    );
  }
});

module.exports = StoryItem;