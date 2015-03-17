var _ = require('lodash');
var request = require('superagent');
//var ApiHelper = require('./ApiHelper');
var ConfigHelper = require('../helpers/ConfigHelper');
var PivotalHelper = require('../helpers/PivotalHelper');

var StoryApi = function(router){
    var self = this;
    

    router.route('/story/:storyId').get(function(req, response){
        var storyId = req.params.storyId;

        var ret = {
            storyId: storyId
        }

        PivotalHelper.get('/stories/' + storyId)
        .promise()
        .then(function(res){
            ret.data = JSON.parse(res.text);
            response.send(ret);
        }); 
    });
};

_.assign(StoryApi.prototype, {
    
});

module.exports = StoryApi;