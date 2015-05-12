var _ = require('lodash');
var React = require('react');
var ReactAsync = require('react-async');
var Router = require('react-router');
var Promise = require('bluebird');
var RouteHandler = Router.RouteHandler;
var Moment = require('moment');
var Preloaded = ReactAsync.Preloaded;

var TeamStore = require('../stores/TeamStore');
var ProjectStore = require('../stores/ProjectStore');
var ReleaseStore = require('../stores/ReleaseStore');
var RepoStore = require('../stores/RepoStore');
var BranchStore = require('../stores/BranchStore');
var PullReqStore = require('../stores/PullReqStore');
var DiffStore = require('../stores/DiffStore');
var StoryStore = require('../stores/StoryStore');

var Spinner = require('../components/Spinner.react');
var Menu = require('../components/Team/Menu.react');
var PullReqsHeader = require('../components/Team/PullReqsHeader.react');
var PullReqsList = require('../components/Team/PullReqsList.react');
var LatestRelease = require('../components/Project/LatestRelease.react');
var MasterList = require('../components/Team/Master/MasterList.react');
var ReleaseList = require('../components/Team/Releases/ReleaseList.react');

var TeamProjectController = React.createClass({
    mixins: [Router.State, ReactAsync.Mixin],
    initState: false,
    loadedProjects: {},
    getInitialStateAsync: function(cb){
        var self = this;
        this.initState = true;
        this._buildRequiredState()
            .then(function(state){
                self.initState = false;
                cb(null, state);
                // Go out and finish loading aditional state data
                return self._buildAdditionalState(state);
            });
    },

    componentDidMount: function() {
        TeamStore.addChangeListener(this._onChange);
        ProjectStore.addChangeListener(this._onChange);
        ReleaseStore.addChangeListener(this._onChange);
        RepoStore.addChangeListener(this._onChange);
        BranchStore.addChangeListener(this._onChange);
        PullReqStore.addChangeListener(this._onChange);
        DiffStore.addChangeListener(this._onChange);
        StoryStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        TeamStore.removeChangeListener(this._onChange);
        ProjectStore.removeChangeListener(this._onChange);
        ReleaseStore.removeChangeListener(this._onChange);
        RepoStore.removeChangeListener(this._onChange);
        BranchStore.removeChangeListener(this._onChange);
        PullReqStore.removeChangeListener(this._onChange);
        DiffStore.addChangeListener(this._onChange);
        StoryStore.addChangeListener(this._onChange);
    },
    componentWillReceiveProps: function() {

        /* Reset the State */
        // We're resetting the state to allow the progress bar loader to display
        // However if we detect it has already been loaded into the Stores, we're not going
        // to worry about it.
        if(!this.loadedProjects[this._getProjectName()])
        {
            this.replaceState({ loadProgress: 1 });
        }

        this._onChange();
    },
    render: function(){
        //console.log("TeamProjectController#render this.getParams()", this.getParams());
        //console.log("TeamProjectController#render this.state", this.state);
        var teamName = this.getParams().teamName;
        var projectDisplay = (this.state.project) ? this.state.project.display : '';

        /* Before Async Load */
        if(!this.state.project)
        {
            return <Spinner useProgress={true} progress={this.state.loadProgress}/>;
        }


        return (
            <div className="col-md-12">
                <div className="header">
                    <h1>Project: {projectDisplay}</h1>
                    <LatestRelease releases={this.state.latestReleases} />
                </div>
                <div className="pure-u-1-2" style={{"padding-right":"10px;"}}>
                    <PullReqsHeader pullReqsCount={_.keys(this.state.pullReqs).length}/>
                    <PullReqsList pullReqs={this.state.pullReqs} branches={this.state.branches} project={this.state.project} stories={this.state.stories} />
                </div>
                <div className="pure-u-1-2">
                    <MasterList masters={this.state.masters} project={this.state.project} stories={this.state.stories} />
                </div>
                <div className="pure-u-1-1">
                    <ReleaseList releases={this.state.releases} project={this.state.project} stories={this.state.stories} />
                </div>
            </div>

        );
    },
    _updateProgress: function(progress){

        var loadProgress = (this.state.loadProgress) ? this.state.loadProgress : 0;
        loadProgress = loadProgress + progress;
        this.setState({loadProgress: loadProgress});
    },
    _buildCount: 0,
    _buildRequiredState: function(){
        var self = this;

        self._buildCount++;
        //console.log("TeamProjectController#_buildRequiredState self._buildCount", self._buildCount);

        var state = {
            project: null,
            team: null,
            repos: {},
            branches: {},
            pullReqs: {},
            latestReleases: [],
            storyIds: {},
            stories: {}
        };

        return TeamStore.get(self._getTeamName())
            .then(function(team){
                self._updateProgress(15);
                state.team = team;
                return ProjectStore.get(self._getProjectName());
            }).then(function(project){
                self._updateProgress(15);
                state.project = project;

                // Doing repos, releases, and pullReqs in parallel
                var promises = [
                    self._buildState_getRepos(state).then(function(repos){
                        self._updateProgress(15);
                        state.repos = repos;
                    }),
                    self._buildState_getLatestReleases(state).then(function(latestReleases){
                        self._updateProgress(20);
                        state.latestReleases = latestReleases;
                    }),
                    self._buildState_getPullReqs(state).then(function(pullReqs){
                        self._updateProgress(20);

                        state.pullReqs = pullReqs;
                    })
                ];

                return Promise.all(promises).then(function(){
                    self._updateProgress(10);
                    // branches depend on pullReqs to filter them out, so we do that after.
                    return self._buildState_getBranches(state);
                });
            }).then(function(branches){
                self._updateProgress(10);
                state.branches = branches;
                self.loadedProjects[self._getProjectName()] = true;
                //console.log("TeamProjectController#_buildState finished", state);
                return self._buildState_getMaster(state);
            }).then(function(masters){
                state.masters = masters;
                return state;
            });
    },
    _buildAdditionalState: function(state){
        var self = this;
        return self._buildState_getPullReqDiffs(state).then(function(){
            return self._buildState_getStories(state);
        }).then(function(stories){
            state.stories = stories;
            return self._buildState_getReleases(state);
        }).then(function(releases){
            state.releases = releases;

            // We're going to run and get the next batch of Stories
            // We do this so the HTTP requests of the high priorities
            // stories go through first.
            return self._buildState_getStories(state);
        }).then(function(stories){
            state.stories = stories;

            return state; // Make sure the last thing we do is return the state
        });
    },
    _buildState_getRepos: function(state){
        var promises = [];

        var collectedRepos = {};

        _.forEach(state.project.repoNames, function(repoName){
            var repoPromise = RepoStore.get(repoName).then(function(repo){
                collectedRepos[repoName] = repo;
            });

            promises.push(repoPromise);
        });

        return Promise.all(promises).then(function(){
            return collectedRepos;
        });
    },
    _buildState_getLatestReleases: function(state){
        var promises = [];

        var collectedReleases = [];

        _.forEach(state.project.repoNames, function(repoName){
            var releasePromise = ReleaseStore.getLatest(repoName).then(function(latestRelease){
                collectedReleases.push(latestRelease);
            });

            promises.push(releasePromise);
        });

        return Promise.all(promises).then(function(){
            return collectedReleases;
        });
    },
    _buildState_getPullReqs: function(state){
        var collectedPullReqs = {};
        var promises = [];

        _.forEach(state.project.repoNames, function(repoName){
            var pullReqPromise = PullReqStore.getAll(repoName).then(function(pullReqs){
                _.forEach(pullReqs, function(pullReqData){
                    var branchName = pullReqData.head.ref;
                    if(!collectedPullReqs[branchName])
                    {
                        collectedPullReqs[branchName] = {};
                    }

                    // Add Story Ids
                    state.storyIds = _.assign(state.storyIds, pullReqData.storyIds);

                    collectedPullReqs[branchName][repoName] = pullReqData;
                });
            });

            promises.push(pullReqPromise);
        });

        return Promise.all(promises).then(function(){
            return collectedPullReqs;
        });
    },
    _buildState_getBranches: function(state){
        var collectedBranches = {};
        var promises = [];

        _.forEach(state.project.repoNames, function(repoName){
            var branchPromise = BranchStore.getAll(repoName).then(function(branches){
                _.forEach(branches, function(branch){
                    if(state.pullReqs[branch.name] && state.pullReqs[branch.name][repoName])
                    {
                        // Keep it out, it already is in one of the pull requests
                    }
                    else if(/^v?[\d]+\.[\d]+\.[\d]+$/.test(branch.name))
                    {
                        // Keep it out, it is a version number since before we used
                        // tags we used branches for releases
                    }
                    else if(state.repos[repoName] && state.repos[repoName].default_branch == branch.name)
                    {
                        // This is master/develop/etc, keep it out
                    }
                    else
                    {
                        // Put it in
                        if(!collectedBranches[branch.name])
                        {
                            collectedBranches[branch.name] = {};
                        }

                        collectedBranches[branch.name][repoName] = branch;
                    }
                });
            });

            promises.push(branchPromise);
        });

        return Promise.all(promises).then(function(){
            return collectedBranches;
        });
    },
    _buildState_getMaster: function(state){
        var masters = {};
        var promises = [];

        _.forEach(state.project.repoNames, function(repoName){
            // Get the latest release for this repo
            var release = _.filter(state.latestReleases, function(release){
                if(release.repo == repoName)
                {
                    return release;
                }
            }).pop(); // Grab the first array item since we will only return one.

            //console.log("TeamProjectController#_buildState_getMaster state", state)

            var masterName = state.repos[repoName].default_branch;

            var masterPromise = BranchStore
                .get(repoName, masterName)
                .then(function(masterBranch){
                    masters[repoName] = masterBranch || {};
                    console.log('Masters',masters);

                    return DiffStore.getSimple(repoName, release.tag_name, masterName).then(function(diff){
                        // Assign storyIds to state list so they can get looked up
                        state.storyIds = _.assign(state.storyIds, diff.storyIds);
                        masters[repoName].diff = diff;
                    });
                });

            promises.push(masterPromise);
        });

        return Promise.all(promises).then(function(){
            return masters;
        });
    },

    /**
     * We do this one a little differently since diffs can take longer. So we
     * request them lazily and only add them to the state once they are cached
     * in the store.
     */
    _buildState_getPullReqDiffs: function(state){
        //console.log("TeamProjectController#_buildState_getPullReqDiffs", state);

        _.forEach(state.pullReqs, function(pullReqBranches){
            _.forOwn(pullReqBranches, function(pullReq, repoName){
                // Grab Diffs, but don't wait for them since they can take a longer time.
                var diffPromise = DiffStore.getSimple(repoName, pullReq.base.ref, pullReq.head.ref);
                if(diffPromise.isFulfilled())
                {
                    pullReq.diff = diffPromise.value();
                    state.storyIds = _.assign(state.storyIds, pullReq.diff.storyIds);
                }
            });
        });

        return Promise.resolve(state);
    },

    _buildState_getReleases: function(state){
        var collectedReleases = {};
        var promises = [];

        _.forEach(state.repos, function(repo){
            var promise = ReleaseStore.getAll(repo.name)
                .then(function(releases){
                    _.forEach(releases, function(currentRelease, i){
                        // We only show if we have a previous release to diff against
                        if(releases[i + 1])
                        {
                            if(!collectedReleases[currentRelease.tag_name])
                            {
                                collectedReleases[currentRelease.tag_name] = {};
                            }

                            collectedReleases[currentRelease.tag_name][repo.name] = currentRelease;

                            var prevRelease = releases[i + 1];
                            var diffPromise = DiffStore.getSimple(repo.name, prevRelease.tag_name, currentRelease.tag_name);
                            if(diffPromise.isFulfilled())
                            {
                                currentRelease.diff = diffPromise.value();
                                state.storyIds = _.assign(state.storyIds, currentRelease.diff.storyIds);
                            }
                        }
                    });
                });
        });

        return Promise.all(promises).then(function(){
            return collectedReleases;
        });
    },

    // Same as the diffs, we're going to load these lazily
    _buildState_getStories: function(state){
        // Kick off the promise to get all these story ids
        // but don't wait for it.
        StoryStore.getMany(state.storyIds);

        return StoryStore.getManyCached(state.storyIds);
    },
    _onChange_queued: false,
    _onChange_deferredCount: 0,
    _onChange: function() {
        var self = this;
        if(this.initState)
        {
            //console.log("TeamProjectController#_onChange initState is set, skipping");
            return;
        }

        if(self._onChange_queued)
        {
            self._onChange_deferredCount++;
            console.log("TeamProjectController#_onChange is already queued, _onChange_deferredCount", self._onChange_deferredCount)
            return;
        }

        self._onChange_queued = true;
        self._onChange_deferredCount = 0;

        setTimeout(function(){
            self._buildRequiredState().then(function(state){
                return self._buildAdditionalState(state);
            }).then(function(state){
                self.setState(state);
                self._onChange_queued = false;

                if(self._onChange_deferredCount > 0)
                {
                    self._onChange();
                }
            });
        }, 500);
    },
    _getTeamName: function(){
        return this.getParams().teamName;
    },
    _getProjectName: function(){
        return this.getParams().projectName;
    }

});

module.exports = TeamProjectController;
