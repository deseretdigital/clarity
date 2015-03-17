var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var StoryHelper = require('./StoryHelper');

var DiffHelper = function(){};

_.assign(DiffHelper.prototype, {
    format: function (diff){
        var obj = {
            status: diff.status,
            aheadBy: diff.ahead_by,
            behindBy: diff.behind_by,
            totalCommits: diff.total_commits,
            additions: 0,
            deletions: 0,
            changes: 0,
            files: [],
            authors: [],
            commits: [],
            storyIds: {}
        };

        _.forEach(diff.files, function(file){
            obj.files.push(file.filename);
            obj.additions   += file.additions;
            obj.deletions   += file.deletions;
            obj.changes     += file.changes;
        });

        _.forEach(diff.commits, function(commitData){
            var name        = commitData.commit.author.name;
            var hash        = commitData.sha.substring(0,7);
            var url         = commitData.html_url;
            var message     = commitData.commit.message;  
            var ago         = moment(commitData.commit.author.date).fromNow();

            if(_.indexOf(obj.authors, name) < 0)
            {
                obj.authors.push(name);
            }

            obj.storyIds = _.assign(obj.storyIds, StoryHelper.parse(message));

            obj.commits.push({
                name: name,
                hash: hash,
                url: url,
                message: message,
                ago: ago
            });
        });

        return obj;
    }
});

module.exports = new DiffHelper();