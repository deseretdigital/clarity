var _ = require('lodash');
var request = require('superagent');
//var ApiHelper = require('./ApiHelper');
var ConfigHelper = require('../helpers/ConfigHelper');

var TeamsApi = function(router){
    var self = this;
    

    router.route('/teams').get(function(req, res){
        var ret = {
            data: ConfigHelper.config.teams
        };

        res.send(ret);
    });
};

_.assign(TeamsApi.prototype, {
    
});

module.exports = TeamsApi;