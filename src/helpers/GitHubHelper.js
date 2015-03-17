var GitHub = require("github"),
    ConfigHelper = require('./ConfigHelper'),
    Promise = require('bluebird');

var GitHubClient = new GitHub({
    // required
    version: "3.0.0",
    // optional
    //debug: true,
    protocol: "https",
    timeout: 10000
});

GitHubClient.authenticate({
    type: "oauth",
    token: ConfigHelper.config.github.token
});

module.exports = {
    client: GitHubClient
};