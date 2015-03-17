var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var pattern = /\[\#(\d+)\]/g;

var StoryHelper = function(){};

_.assign(StoryHelper.prototype, {
    parse: function(text){
        var storyIds = {};

        var ids = text.match(pattern);

        _.forEach(ids, function(id){
            id = id.replace(/[\#\[\]]/g, "");
            storyIds[id] = id;
        });

        return storyIds;
    }
});

module.exports = new StoryHelper();