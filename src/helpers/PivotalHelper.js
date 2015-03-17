var ConfigHelper = require('./ConfigHelper'),
    Promise = require('bluebird')
    Request = require('superagent-bluebird-promise');

var baseUrl = 'https://www.pivotaltracker.com/services/v5';

var authRequest = function(request){
    return request.accept('application/json')
        .type('json')
        .set('X-TrackerToken', ConfigHelper.config.pivotal.token);
};

var post = function(url){
    var req = Request.post(baseUrl + url);
    return authRequest(req);
};

var get = function(url){
    var req = Request.get(baseUrl + url);
    return authRequest(req);
};

module.exports = {
    authRequest: authRequest,
    post: post,
    get: get
};