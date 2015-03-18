var _ = require('lodash');
var request = require('superagent');
//var ApiHelper = require('./ApiHelper');
var ConfigHelper = require('../helpers/ConfigHelper');
var PivotalHelper = require('../helpers/PivotalHelper');
var Promise = require('bluebird');

var StoryApi = function(router){
    var self = this;
    

    router.route('/story/:storyId').get(function(req, response){
        var storyId = req.params.storyId;

        var ret = {
            storyId: storyId
        }

        self.getStory(storyId)
            .then(function(story){
                ret.data = story;
                response.send(ret);
            });
    });

    router.route('/story/bulk-retrieve').post(function(req, response){
        var stories = {};
        var storyIds = req.body.storyIds;

        var ret = {
            storyIds: storyIds
        };

        var urls = _.map(storyIds, function(storyId){
            return '/services/v5/stories/' + storyId;
        });

        PivotalHelper.post('/aggregator')
        .send(urls)
        .promise()
        .then(function(res){
            _.forEach(JSON.parse(res.text), function(individualResponse){
                if(individualResponse && individualResponse.id)
                {
                    stories[individualResponse.id] = individualResponse;
                }
            });

            ret.data = stories;
            response.send(ret);
        });
    });

    router.route('/story/:storyId/add-label').post(function(req, response){
        //console.log('StoryApi#post /story/:storyId/add-label req', req);
        var storyId = req.params.storyId;
        var projectId = req.body.project;
        var label = req.body.label;

        var ret = {
            storyId: storyId,
            projectId: projectId,
            label: label
        };


        PivotalHelper.post('/projects/' + projectId + '/stories/' + storyId + '/labels')
        .send({name: label})
        .promise()
        .then(function(res){
            ret.data = res;
            response.send(ret);
        });
    });
};

_.assign(StoryApi.prototype, {
    getStory: function(storyId){
        return PivotalHelper.get('/stories/' + storyId)
        .promise()
        .then(function(res){
            return JSON.parse(res.text);
        }); 
    }

});

module.exports = StoryApi;