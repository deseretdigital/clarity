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
            </div>
        
        );
    },
    _updateProgress: function(progress){

        var loadProgress = (this.state.loadProgress) ? this.state.loadProgress : 0;
        loadProgress = loadProgress + progress;
        this.setState({loadProgress: loadProgress});
    },
    _buildRequiredState: function(){
        var self = this;

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
                return state;
            });
    },
    _buildAdditionalState: function(state){
        var self = this;
        return self._buildState_getPullReqDiffs(state).then(function(){
            return self._buildState_getStories(state);
        }).then(function(stories){
            state.stories = stories;
            return state;
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

    // Same as the diffs, we're going to load these lazily
    _buildState_getStories: function(state){
        var stories = {};

        _.forEach(state.storyIds, function(storyId){
            var storyPromise = StoryStore.get(storyId);
            if(storyPromise.isFulfilled())
            {
                stories[storyId] = storyPromise.value();
            }
        });

        return Promise.resolve(stories);
    },
    _onChange: function() {
        var self = this;
        if(this.initState)
        {
            //console.log("TeamProjectController#_onChange initState is set, skipping");
            return;
        }

        this._buildRequiredState().then(function(state){
            return self._buildAdditionalState(state);
        }).then(function(state){
            self.setState(state);
        });
    },
    _getTeamName: function(){
        return this.getParams().teamName;
    },
    _getProjectName: function(){
        return this.getParams().projectName;
    }

});

module.exports = TeamProjectController;
