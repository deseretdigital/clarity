var _ = require('lodash');
var request = require('superagent');
var Promise = require('bluebird');
var NodeCache = require('node-cache');
var ApiHelper = require('../helpers/ApiHelper');
var DiffHelper = require('../helpers/DiffHelper');
var ConfigHelper = require('../helpers/ConfigHelper');
var GitHubClient = require('../helpers/GitHubHelper').client;
var StoryHelper = require('../helpers/StoryHelper');


var RepoApi = function(router){
    var self = this;

    this.cache = new NodeCache({
        stdTTL: 60 * 15,
        checkperiod: 60 * 5
    });

    router.route('/repo/:name').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;

        var ret = {
            orgName: orgName,
            repoName: repoName
        };

        //console.log('RepoApi#route/repo/:name self', self.get);

        self.get(orgName, repoName)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/pull-requests').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;

        var ret = {
            orgName: orgName,
            repoName: repoName
        };

        //console.log('RepoApi#route/repo/:name/pull-requests self', self.get);

        self.getPullRequests(orgName, repoName)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/status/:sha').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;
        var shaHash = req.params.sha;

        var ret = {
            orgName: orgName,
            repoName: repoName
        };

        //console.log('RepoApi#route/repo/:name/pull-requests self', self.get);

        self.getShaStatus(orgName, repoName, shaHash)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/branches').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;

        var ret = {
            orgName: orgName,
            repoName: repoName
        };

        self.getBranches(orgName, repoName)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/branch/:branchName').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;
        var branchName = req.params.branchName;

        var ret = {
            orgName: orgName,
            repoName: repoName,
            branchName: branchName
        };

        self.getBranch(orgName, repoName, branchName)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/releases').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;

        var ret = {
            orgName: orgName,
            repoName: repoName
        };

        self.getReleases(orgName, repoName)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/release/:releaseName').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;
        var releaseName = req.params.releaseName;

        var ret = {
            orgName: orgName,
            repoName: repoName,
            releaseName: releaseName
        };

        self.getRelease(orgName, repoName, releaseName)
            .then(function(data){
                ret.data = data;
                res.send(ret);
            });
    });

    router.route('/repo/:name/diff/:base/:head').get(function(req, res){
        var orgName = ConfigHelper.config.github.orgName;
        var repoName = req.params.name;
        var baseName = req.params.base;
        var headName = req.params.head;
        var simple = (req.query.simple) ? 1 : 0;

        var ret = {
            orgName: orgName,
            repoName: repoName,
            baseName: baseName,
            headName: headName,
            simple: simple
        };

        var cacheKey = ApiHelper.buildCacheKey(ret);
        var cacheEntry = self.cache.get(cacheKey);
        if(cacheEntry[cacheKey]){
            ret.cached = true;
            ret.data = cacheEntry[cacheKey];
            return res.send(ret);
        }

        self.getDiff(orgName, repoName, baseName, headName)
            .then(function(data){
                if(simple)
                {
                    data = DiffHelper.format(data);
                }
                else
                {
                    ret.summary = DiffHelper.format(data);
                }

                self.cache.set(cacheKey, data, 60); // Cache for 1 minute
                ret.data = data;
                res.send(ret);
            })
            .catch(function(err){
                ret.err = err;
                res.send(ret);
            });
    });
};

_.assign(RepoApi.prototype, {
    get: function(orgName, repoName)
    {
        var self = this;

        return new Promise(function(resolve, reject){
            var cacheKey = 'get_' + orgName + '_' + repoName;
            var cached = self.cache.get(cacheKey);
            if(cached[cacheKey])
            {
                return resolve(cached[cacheKey]);
            }

            GitHubClient.repos.get({
                user: orgName,
                repo: repoName
            }, function(err, data){
                if(err)
                {
                    return reject(err);
                }

                self.cache.set(cacheKey, data);
                resolve(data);
            });
        });
    },

    getPullRequests: function(orgName, repoName){
        var self = this;

        return new Promise(function(resolve, reject){
            var pomises = [];

            GitHubClient.pullRequests.getAll({
                user: orgName,
                repo: repoName
            }, function(err, res){
                if(err){
                    return reject(err);
                }
                res = self.formatPullRequests(res);
                resolve(res);
            });
        });
    },

    formatPullRequests: function(pullReqs){
        _.forEach(pullReqs, function(pullReq){
            pullReq.storyIds = StoryHelper.parse(pullReq.title);
        });

        return pullReqs;
    },

    getShaStatus: function(orgName, repoName, shaHash){
        var self = this;

        return new Promise(function(resolve, reject){
            var pomises = [];

            GitHubClient.statuses.get({
                user: orgName,
                repo: repoName,
                sha: shaHash
            }, function(err, res){
                if(err){
                    return reject(err);
                }

                resolve(res);
            });
        });
    },

    getBranches: function(orgName, repoName){
        var self = this;

        return new Promise(function(resolve, reject){
            GitHubClient.repos.getBranches({
                user: orgName,
                repo: repoName
            }, function(err, res){
                // console.log("pre setBranchesCaches");

                var promises = _.map(res, function(branchRecord){
                    return self.getBranch(orgName, repoName, branchRecord.name);
                });

                Promise.all(promises).then(function(allBranches){
                    resolve(allBranches);
                });
            });
        });
    },

    getBranch: function(orgName, repoName, branchName){
        var self = this;

        return new Promise(function(resolve, reject){
            GitHubClient.repos.getBranch({
                user: orgName,
                repo: repoName,
                branch: branchName
            }, function(err, res){
                if(err){
                    return reject(err);
                }

                // Save the repo/owner details
                res.repo = repoName;
                res.owner = orgName;

                resolve(res);
            });
        });
    },

    getReleases: function(orgName, repoName){
        var self = this;

        return new Promise(function(resolve, reject){
            GitHubClient.releases.listReleases({
                owner: orgName,
                repo: repoName,
                per_page: 6
            }, function(err, res){
                if(err){
                    return reject(err);
                }

                _.forEach(res, function(release){
                    release.repo = repoName;
                });
                return resolve(res);
            });
        });
    },

    getRelease: function(orgName, repoName, releaseName){
        var self = this;

        return self.getReleases(orgName, repoName)
        .then(function(allReleases){
            var foundRelease = null;

            _.forEach(allReleases, function(release){
                if(release.tag_name == releaseName)
                {
                    foundRelease = release;
                }
            });

            return foundRelease;
        });
    },

    getDiff: function(orgName, repoName, baseName, headName){
        var self = this;

        return new Promise(function(resolve, reject){
            GitHubClient.repos.compareCommits({
                user: orgName,
                repo: repoName,
                base: baseName,
                head: headName
            }, function(err, res){
                if(err){
                    return reject(err);
                }

                return resolve(res);
            });
        });
    }
});

module.exports = RepoApi;
