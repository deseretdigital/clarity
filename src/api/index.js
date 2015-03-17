var express = require('express');
var router = express.Router();
var TeamsApi = require('./TeamsApi');
var ProjectApi = require('./ProjectApi');
var RepoApi = require('./RepoApi');
var StoryApi = require('./StoryApi');

var api = {
    teams: new TeamsApi(router),
    project: new ProjectApi(router),
    repo: new RepoApi(router),
    story: new StoryApi(router),
};

module.exports = router;