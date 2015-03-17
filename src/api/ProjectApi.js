var _ = require('lodash');
var request = require('superagent');
//var ApiHelper = require('./ApiHelper');
var ConfigHelper = require('../helpers/ConfigHelper');

var ProjectApi = function(router){
    var self = this;
    

    router.route('/projects').get(function(req, res){
        var ret = {
            data: ConfigHelper.config.projects
        };

        res.send(ret);
    });
};

_.assign(ProjectApi.prototype, {
    
});

module.exports = ProjectApi;