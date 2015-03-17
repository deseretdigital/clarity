var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Promise = require('bluebird');

var StoryItem = require('../../Story/StoryItem.react');

var MasterList = React.createClass({
    
    getDefaultProps: function(){
        return {
            masters: {},
            stories: ""
        };
    },
    
    getInitialState: function() {
        return {};
    },
    render: function(){
        var self = this;

        // State Url
        var htmlStageUrl = '';
        if(this.props.project.stageMasterUrl)
        {
            var stageUrl = this.props.project.stageMasterUrl;
            htmlStageUrl = (
                <div className="stageUrl">Stage: 
                    <a href={stageUrl} target="_blank">{stageUrl}</a>
                </div>
            );
        }

        // Get all stories
        var storyIds = {};

        _.forEach(this.props.masters, function(master){
            if(master.diff)
            {
                storyIds = _.assign(storyIds, master.diff.storyIds);
            }
        });

        var htmlStories = _.map(storyIds, function(storyId){
            return <StoryItem id={storyId} data={self.props.stories[storyId]} context={StoryItem.contexts.MASTER} />
        });

        // Commits
        var htmlCommitStats = _.map(this.props.masters, function(master){
            console.log("MasterList#render master", master);
            return (
                <div><strong>{master.repo}:</strong> {master.diff.commits.length}</div>
            );
        });

        

        return (
            <div>
                <h2 className="content-subhead">Stories for Release: {_.keys(storyIds).length}</h2>
                <div className="master">
                    <div className="masterInside">
                        <h3>Master</h3>
                        {htmlStageUrl}
                        <h3>Commits</h3>
                        {htmlCommitStats}
                        <h3>Stories</h3>
                        {htmlStories}
                    </div>
                </div>
            </div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = MasterList;

/* 
<div class="master">
    <div class="masterInside">
        <h3>Master</h3>
        <div class="stageUrl">Stage: <a href="http://cstage.deseretdigital.com/" target="_blank">http://cstage.deseretdigital.com/</a></div>

        <div class="story label-utah.com state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/85086626" target="_blank">#85086626</a>] Search API - Add aggregation options to existing endpoints</h4>
                <div class="labels"><strong>Labels:</strong> utah.com</div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="85086626">Accept QA</button>
            </div>
        </div>

        <div class="story label-hive label-utah.com state-started">
            <div class="storyInside">
                <div class="state">started</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/88066522" target="_blank">#88066522</a>] Ability to edit property detail page data</h4>
                <div class="labels"><strong>Labels:</strong> hive, utah.com</div>
            </div>
            <div class="qaStatus qaNeutral"><strong>QA:</strong> No QA Step Required Currently </div>
        </div>

        <div class="story state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/88665610" target="_blank">#88665610</a>] Hive: Custom page meta tags</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="88665610">Accept QA</button>
            </div>
        </div>

        <div class="story label-softserve state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/88666154" target="_blank">#88666154</a>] Pages: Once overridden, inherited containers should no longer inherit base page changes</h4>
                <div class="labels"><strong>Labels:</strong> softserve</div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="88666154">Accept QA</button>
            </div>
        </div>

        <div class="story label-qa-done-branch state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/88805384" target="_blank">#88805384</a>] Filename and caption not display in media table</h4>
                <div class="labels"><strong>Labels:</strong> qa-done-branch</div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="88805384">Accept QA</button>
            </div>
        </div>

        <div class="story label-no-qa label-softserve state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89006978" target="_blank">#89006978</a>] Generate and update site maps</h4>
                <div class="labels"><strong>Labels:</strong> no-qa, softserve</div>
            </div>
            <div class="qaStatus qaNeutral"><strong>QA:</strong> no-qa - QA Not Possible for this story </div>
        </div>

        <div class="story label-no-qa label-softserve state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89006998" target="_blank">#89006998</a>] Generate Google News site maps</h4>
                <div class="labels"><strong>Labels:</strong> no-qa, softserve</div>
            </div>
            <div class="qaStatus qaNeutral"><strong>QA:</strong> no-qa - QA Not Possible for this story </div>
        </div>

        <div class="story label-softserve state-delivered">
            <div class="storyInside">
                <div class="state">delivered</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89015614" target="_blank">#89015614</a>] Hive: Refactor tags widget</h4>
                <div class="labels"><strong>Labels:</strong> softserve</div>
            </div>
            <div class="qaStatus qaNeutral"><strong>QA:</strong> No QA Step Required Currently </div>
        </div>

        <div class="story label-softserve state-delivered">
            <div class="storyInside">
                <div class="state">delivered</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89015636" target="_blank">#89015636</a>] Hive: Add tag site support</h4>
                <div class="labels"><strong>Labels:</strong> softserve</div>
            </div>
            <div class="qaStatus qaNeutral"><strong>QA:</strong> No QA Step Required Currently </div>
        </div>

        <div class="story label-qa-done-branch state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89279852" target="_blank">#89279852</a>] Enable 'Story' content type in container rules</h4>
                <div class="labels"><strong>Labels:</strong> qa-done-branch</div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="89279852">Accept QA</button>
            </div>
        </div>

        <div class="story state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89454854" target="_blank">#89454854</a>] View template options in page builder</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="89454854">Accept QA</button>
            </div>
        </div>

        <div class="story state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89454898" target="_blank">#89454898</a>] Save template options in page builder</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="89454898">Accept QA</button>
            </div>
        </div>

        <div class="story state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89454952" target="_blank">#89454952</a>] Send template options in pages API</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="89454952">Accept QA</button>
            </div>
        </div>

        <div class="story state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89455034" target="_blank">#89455034</a>] Update Fenix SDK to send template options to CMS</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="89455034">Accept QA</button>
            </div>
        </div>

        <div class="story label-qa-done-branch label-video-management state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/89523218" target="_blank">#89523218</a>] Videos: Add Vimeo support</h4>
                <div class="labels"><strong>Labels:</strong> qa-done-branch, video-management</div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="89523218">Accept QA</button>
            </div>
        </div>

        <div class="story state-started">
            <div class="storyInside">
                <div class="state">started</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/90020060" target="_blank">#90020060</a>] Media: Refactor image edit in ReactJS (&amp; make it work)</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaNeutral"><strong>QA:</strong> No QA Step Required Currently </div>
        </div>

        <div class="story state-accepted">
            <div class="storyInside">
                <div class="state">accepted</div>
                <h4 class="title">[<a href="https://www.pivotaltracker.com/story/show/90024100" target="_blank">#90024100</a>] Add Tests for: Video API changes to support Vimeo [#89523218]</h4>
                <div class="labels"><strong>Labels:</strong> </div>
            </div>
            <div class="qaStatus qaAttention"><strong>QA:</strong> missing qa-done-master - QA required for this story!
                <button class="pure-button button-success addLabel" data-label="qa-done-master" data-story="90024100">Accept QA</button>
            </div>
        </div>

        <h3>Commits</h3>

        <div class="commitList">
            <div class="commitListInside">
                <h3>Repo: common-cms (55) [<a class="toggle" data-toggle="masterCommitList_common-cms" href="#">view commits</a>]</h3>
                <ul id="masterCommitList_common-cms" style="display:none;">

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/c53bbf6bd10707e7d8d896561b0a960a4990e2be" target="_blank">c53bbf6</a> - Jeremy Hicks: Turn off dev mode</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/c9fe2522b4dab7de389e9aef052e2158b3be8147" target="_blank">c9fe252</a> - Jeremy Hicks: Merge branch 'dc-import' of github.com:deseretdigital/common-cms into dc-import</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/c5f0e3501aedf04e8319edd556d0587a4a4f7f36" target="_blank">c5f0e35</a> - Spenser Roark: Commenting out changes to test for content_profile_id issues</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/9a3a4efbc416aa4f279774c460a6e218b82a72a7" target="_blank">9a3a4ef</a> - Spenser Roark: Merge branch 'dc-import' into utah-dc</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/90fc194a1836f9240f7dbd6d03ca62e0df8ed559" target="_blank">90fc194</a> - Spenser Roark: Removed test code, changed dev to false</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/462e3804c181f9b7ad8aef661463e438f8559226" target="_blank">462e380</a> - Spenser Roark: Removed my edited params</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/f8f2d04bd2632492b35ebd6120880228486fb0aa" target="_blank">f8f2d04</a> - Matt Montgomery: Changes to route and page api controllers to support metadata inheritance</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/a1c8a5ce8e69a5e5b21b4894b945086237b6ac80" target="_blank">a1c8a5c</a> - Stanislav Monarshuk: Added support for multiple levels of page inheritance</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/a32ccbb7cc6f10771dc05618f924a478653271a2" target="_blank">a32ccbb</a> - Stanislav Monarshuk: Resolved infinite recursion loop in page inheritance</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/ea3acbabba57896cadcab3f4bbcd859f1f07fbc3" target="_blank">ea3acba</a> - Matt Montgomery: More test updates</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/07136d1044c6b31a7c299add290f23b2740e7bc4" target="_blank">07136d1</a> - Matt Montgomery: Catching up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/9355228cb0e00995372fb967a139b5d0ed26f992" target="_blank">9355228</a> - Jeremy Hicks: Aggregations done</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/055797102ad63509990aebde649862ebf1107696" target="_blank">0557971</a> - vagrant: Take out minimum stability dev and set Symfony to 2.6</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/4d4373fdbfc8d6c97f7a4bc8275bdcf28b90333c" target="_blank">4d4373f</a> - Jeremy Hicks: Remove php not showing deprecation errors</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/a1a916feb842f86f256cd2e376845508add7e794" target="_blank">a1a916f</a> - Jeremy Hicks: Remove php not showing deprecation errors</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/aa9d3964e178f85d8a8172aab2910dc4fc03d453" target="_blank">aa9d396</a> - Stanislav Monarshuk: Enabled site content id content profile</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/4227fdea2839781e2233bd67a80fe9bb4e5b3c24" target="_blank">4227fde</a> - Stanislav Monarshuk: Added sitemap generate command. Implemented sitemap urls for routes and articles</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/a46e4b8a06c4fc8ec2380e426f4c3c752a386b6b" target="_blank">a46e4b8</a> - Matt Montgomery: Merge pull request #260 from deseretdigital/tests Updates to tests</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/46e6938bd66b9f15471dce3c56f7b7406707c74b" target="_blank">46e6938</a> - Serhii Yehorov: added author URLs to sitemap [#89006978]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/a9f3be3f1efb27e9a692f7fb0317c765c4066e55" target="_blank">a9f3be3</a> - Matt Montgomery: Turning off utah.com content profile worker use</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/37db9158ac8e844dc171d360b3d8e2dac6e4d13f" target="_blank">37db915</a> - Matt Montgomery: Fixing worker</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/d028aac935de3221c4906f6eabf3ca64786bd1f0" target="_blank">d028aac</a> - Brendan Warkentin: Video API changes to support Vimeo</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/fd86d600ffacf484a1c0459b96a1b8892e7da6c3" target="_blank">fd86d60</a> - Stanislav Monarshuk: Added google news sitemap generate command</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/13b5ec866c56f604578983d3a4539e716b783fc4" target="_blank">13b5ec8</a> - Stanislav Monarshuk: Merge branch 'generate-site-maps' of github.com:deseretdigital/common-cms into generate-site-maps</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/085c9b113958c825129036510fee3deca134c2fb" target="_blank">085c9b1</a> - Serhii Yehorov: added support for multiple sitemaps and sitemap index file generation [#89006978]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/52d0ebae72eefae184886e04f83582d47cb1f72f" target="_blank">52d0eba</a> - Serhii Yehorov: Merge branch 'generate-site-maps' of github.com:deseretdigital/common-cms into generate-site-maps</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/ad930d28cf62b9db6e4ae554fb3e36592d732136" target="_blank">ad930d2</a> - Mark Lind: Update to check for metadata key in extended pages data.</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/252ba5a7d4943e8f7b935abccc001450848bed20" target="_blank">252ba5a</a> - Jeremy Hicks: Updating templates to handle options</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/5894929de7b8b4361a2f321b0e225dd0edece62b" target="_blank">5894929</a> - Jeremy Hicks: Merge branch 'master' into template-options</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/5f1761754b505146fa2d725be3346092d2834dd4" target="_blank">5f17617</a> - Jeremy Hicks: Update template site updater to handle updating templates and not just adding them</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/0b0098091256898563526e13d16f77b96e44b04e" target="_blank">0b00980</a> - Stanislav Monarshuk: Added site field to Tag model</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/1ab4903017ac3c38585766b9b9b004f98cc19c80" target="_blank">1ab4903</a> - Justin Carmony: Merge pull request #263 from deseretdigital/video-vimeo Video API changes to support Vimeo [#89523218]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/db541f210d50329d9af5a0ff6b2a488302b58352" target="_blank">db541f2</a> - Justin Carmony: Catching up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/a3fd5fca924d8690a829ca448d9c011fb00aadef" target="_blank">a3fd5fc</a> - Justin Carmony: Merge pull request #258 from deseretdigital/pages-multiple-levels-of-inheritance Added support for multiple levels of page inheritance</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/960dddd497e10cf76af49d686d0bb7b7ebf2b490" target="_blank">960dddd</a> - Justin Carmony: Adding psr-2 checking to travis</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/9694e8556e7bba4c6fd14475f961bfc14c227548" target="_blank">9694e85</a> - Justin Carmony: Disabling the travis check for now</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/c744579b77ccfd1c48f1b9ca9253ad25ae1f0479" target="_blank">c744579</a> - Justin Carmony: Adding lint.sh and some documentation</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/e3e3981e49650a5ea22fcd3596a3f29a7f7c36b7" target="_blank">e3e3981</a> - Justin Carmony: Merge pull request #267 from deseretdigital/psr2 Psr2

                    </li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/fd2e093b501cda5d4491c793facfedc51f5d2a29" target="_blank">fd2e093</a> - Brendan Warkentin: Tests for API functions related to YouTube and Vimeo support</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/1ccc9de59380617f2c2d16985ad72bd5fa3be0c7" target="_blank">1ccc9de</a> - Justin Carmony: Merge pull request #265 from deseretdigital/template-options Template options [#89455034]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/049c86ca9b02ae4f568bc03570ff956c61d2ff7c" target="_blank">049c86c</a> - Stanislav Monarshuk: Merge branch 'master' into generate-site-maps</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/cb797df4609f3def209ad71308b9c0c2ce2fa1d3" target="_blank">cb797df</a> - Stanislav Monarshuk: Moved tmp path to config parameters</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/83ac62be9fda5508d8bd417c0327adeffeefcb14" target="_blank">83ac62b</a> - Serhii Yehorov: added tags Site field to permissions [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/360a6568be529c65d05be96a94489f3fd1126f50" target="_blank">360a656</a> - Serhii Yehorov: whoops, uncommented access check [#89015636]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/6a9888a3cf780583f31bb49bf60f9fd3e415d436" target="_blank">6a9888a</a> - Justin Carmony: Merge pull request #266 from deseretdigital/refactor-tags-widget Added site field to Tag model</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/16aaf5b85cc4b5fffcee2131280808d6930f6dae" target="_blank">16aaf5b</a> - Jeremy Hicks: Update composer lock</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/6ee8e6ade028f1c84fd2c9761c6af9e76a2c995f" target="_blank">6ee8e6a</a> - Jeremy Hicks: Resolve conflict</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/892205f7559a5024d16db2f1be56964096b14f96" target="_blank">892205f</a> - Justin Carmony: Catch up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/398ebeef0c33b6a0aa064b6bcabbc9a86af321f0" target="_blank">398ebee</a> - Justin Carmony: Merge pull request #271 from deseretdigital/utah-dc Adding Utah.com DC support</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/26774ce03d11bd201580dc840271c8526b24d33b" target="_blank">26774ce</a> - Justin Carmony: Merge pull request #272 from deseretdigital/draft-story-showing-up-on-site Enabled site content id content profile</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/002446eec98561ee03b44c110b589521176e982a" target="_blank">002446e</a> - Justin Carmony: Catching up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/763807b7d16ed783cac21052b3d136181d86e3d4" target="_blank">763807b</a> - Justin Carmony: Merge pull request #262 from deseretdigital/elastic-search-aggregates Aggregations done [#85086626]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/cf5663ec2c632746e6e575117c7290246104e0f7" target="_blank">cf5663e</a> - Justin Carmony: Merge pull request #268 from deseretdigital/yt-vimeo-api-tests Tests for API functions related to YouTube and Vimeo support [#90024100]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/3bfe1bae700dd3f1fa19bcbe69697c1db4fb4fc6" target="_blank">3bfe1ba</a> - Justin Carmony: Merge pull request #264 from deseretdigital/generate-site-maps Generate site maps [#89006978] [#89006998]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms/commit/bb9500f6003197f238316c826c39651f8d0a1957" target="_blank">bb9500f</a> - Justin Carmony: Merge pull request #256 from deseretdigital/edit-meta-page-title Changes to route and page api controllers to support metadata inheritance [#88665610]</li>

                </ul>
            </div>
        </div>

        <div class="commitList">
            <div class="commitListInside">
                <h3>Repo: common-cms-ui (101) [<a class="toggle" data-toggle="masterCommitList_common-cms-ui" href="#">view commits</a>]</h3>
                <ul id="masterCommitList_common-cms-ui" style="display:none;">

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/a975a1c058764390136bdb537ee6b2c5e2d9a926" target="_blank">a975a1c</a> - Justin Carmony: Adding react</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/64e9c4c1c957f8e9ed2ba88428498edd6747680b" target="_blank">64e9c4c</a> - Justin Carmony: Catching up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/53e8331438fd43307408f759501cd0c2891019ae" target="_blank">53e8331</a> - Matt Montgomery: Added widget-base</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/4574a0e6eb9c7c7cbfcc927146e6a50a0608d17d" target="_blank">4574a0e</a> - Matt Montgomery: Fixing lint issues</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/950bd2e88ab9733e613d1865476f77320ad7f9ca" target="_blank">950bd2e</a> - Justin Carmony: moar work</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/7dd70fd39a1bd79d7006fbed97e30e956eb74f53" target="_blank">7dd70fd</a> - Justin Carmony: moar work</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/96bc70a9bb6cc84f122214dadd59c72356663880" target="_blank">96bc70a</a> - Matt Montgomery: Catching up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/2272d8e5033ed607c8903eedb0400a9b1aa83a2a" target="_blank">2272d8e</a> - Nate Christensen: Adds key value pair fields to page edit details</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ee9fdee533fcd60ba97be2de6c999c82f2a6308b" target="_blank">ee9fdee</a> - Matt Montgomery: Added fieldName functionality for field group key values</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/a2260f78ee286940562fef6b5d5787b6d736c596" target="_blank">a2260f7</a> - Matt Montgomery: Fixed key value pair functionality</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/e1dc9eaae1734be0f913ea733d6e49b2f63fe752" target="_blank">e1dc9ea</a> - Matt Montgomery: Fixed broken key-value pair feature</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/82393f30c36d0235c1779bddb85b30c1927633b5" target="_blank">82393f3</a> - Matt Montgomery: Lint fixes</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/6f040f7a7b87576d3c4b93b729e5047370897a9b" target="_blank">6f040f7</a> - Matt Montgomery: Changed page title to hive.pub</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/e883c9f364ef679d1951ec1db6e223778243e615" target="_blank">e883c9f</a> - Illya Usenko: set empty array for modelGroup if it doesn't exist</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/15aca11372b76a9a0be39d5b98243ce58d8e5516" target="_blank">15aca11</a> - Illya Usenko: set empty array for modelGroup if it doesn't exist</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/08d98949d7c3736af1dd42ea6131f042e3c4fd9f" target="_blank">08d9894</a> - Matt Montgomery: Tag widget improvements</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/3f964ed3677a5ab6a17830faa919a52609f7b9ed" target="_blank">3f964ed</a> - Matt Montgomery: Fix</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/6531f334ac7422bc11de8acdcacfce3cfa34c93e" target="_blank">6531f33</a> - Serhii Yehorov: added functionality to change inherited container mode to standard upon data update [#88666154]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/b72f6e9510ba8409c46848a5b15d9d7512df7d93" target="_blank">b72f6e9</a> - Serhii Yehorov: fixed containers reorder issue [#88666154]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/4c307e669eacd0b5026912d73af209dfb339fc16" target="_blank">4c307e6</a> - Stanislav Monarshuk: Improved page inheritance</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/5dc806870cbd53f3019f974525eb0fe9774b2c5d" target="_blank">5dc8068</a> - Serhii Yehorov: enabled 'Story' content type in container rules [#89279852]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/32b14331e10d4d60beddae78f184f2c2a9b04377" target="_blank">32b1433</a> - Brendan Warkentin: Changes to Video widget to support Vimeo videos</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/1b9d2e99645be4a159d469f196c5275797557828" target="_blank">1b9d2e9</a> - Jeremy Hicks: Display page, container, and content template options</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/3dafde24a385d6060d3fa19b95c093fef582705b" target="_blank">3dafde2</a> - Jeremy Hicks: Missing semicolons</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ae0f19dbcc432a3db798ed8fd73061b8792a1529" target="_blank">ae0f19d</a> - Brendan Warkentin: Fixed missing name/credit info in grid of media widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/cf6a3f09df65a944cc6d1a4e22072e0b0dc4192d" target="_blank">cf6a3f0</a> - Brendan Warkentin: Small fix</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/db24eca92471435776a1747f5a72f36f5793b547" target="_blank">db24eca</a> - Justin Carmony: Adds new React Widget For Editing Utah.com Hotels [#88066522] This branch is based off of the react branch. It adds a new widget for editing utah.com hotels, using React wrapped in Tile. Tile is used to load the widget initially, but React takes over from there. All of the React components are located in the directory public/js/components. This widget was also added to the Widgets dropdown menu.</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/01db304751dcec6ddfa7ba0bd1197bc4a928ffc8" target="_blank">01db304</a> - mglind / natec8: Switches default loaded widget to content profiles</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/fb089a65e6e25e3ba5c31d2b4873ffee5f716a61" target="_blank">fb089a6</a> - mglind / natec8: Removes console.log and mistakenly changed videos widget path in the spawner</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/a74e8de9980644f81d8403b9bd00ec5264f662b0" target="_blank">a74e8de</a> - mglind / natec8: Adds new delete icon, moves it to the right, updates styles</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/a0584d6dc5f095d4d5f86d318597a46f8fdb20ec" target="_blank">a0584d6</a> - Jeremy Hicks: Mark default option as selected in dropdown</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/fcfb659ca121e2e8a1b02a1358a69e8c6706a411" target="_blank">fcfb659</a> - Jeremy Hicks: Remove logging</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/dd97ea30215d5e7c5566dd7654b69ea27ddbf1de" target="_blank">dd97ea3</a> - Stanislav Monarshuk: Added generic form and text field componens. Added form to TagsWidget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/81c4dafdf306a55d4e61884037bd9c5de39c8524" target="_blank">81c4daf</a> - Jeremy Hicks: Saving page template option value to page data</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ee84cec3ddd36846af9950a1740c949c8a83d6c9" target="_blank">ee84cec</a> - Jeremy Hicks: Fixed so saving to template_values, not template_options</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/8f412e75517422ef78d9af9f6eb7f93674c064ed" target="_blank">8f412e7</a> - Jeremy Hicks: Move template option saving to a named function</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/8c84f696b75a9b66f6cf2244fe2e0171648d74c7" target="_blank">8c84f69</a> - Jeremy Hicks: Show values when they have been saved.</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/18efdf27a6bfff145be362812ec013f3434f741e" target="_blank">18efdf2</a> - Stanislav Monarshuk: Added select component. Added select field to Tags widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/571785288035b870e454d2c96de7c71e36a3bf3d" target="_blank">5717852</a> - Stanislav Monarshuk: Added checkbox component. Added checkbox field to Tags widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/da317f3f2d7af0fa8e8b3e6827050cc49d01ace1" target="_blank">da317f3</a> - Stanislav Monarshuk: Added form validation. Added details panel active mode</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/fdce76033df03f3c9ed815fa1d6008387cd210c4" target="_blank">fdce760</a> - Jeremy Hicks: Clean up optionBuffer, move to options, remove places test</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/3a765d6fc396e4a248056f99d3d8253c41218cfb" target="_blank">3a765d6</a> - Serhii Yehorov: added basic grid and panel styles, small updates to grid and panel components [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/4e946c49219f2f206515ca69ca856664ebf52110" target="_blank">4e946c4</a> - Serhii Yehorov: resolved conflicts</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/829e525bbac4c55bfc67cee8bf449bafffef0ed3" target="_blank">829e525</a> - Jeremy Hicks: Required validation done for template options fields</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/e9ca5b23dc7923b34a66c289a8a34355c9dcdec3" target="_blank">e9ca5b2</a> - Jeremy Hicks: Add panel buttons and get them working</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/53e19a6de1fc687a56f80738548826084883bbec" target="_blank">53e19a6</a> - Stanislav Monarshuk: Added Notification mixin. Added notification to tags widget save func</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/439931cb534457be305c5f5a9b87c2cd573a9726" target="_blank">439931c</a> - Stanislav Monarshuk: Merge branch 'refactor-tags-widget' of github.com:deseretdigital/common-cms-ui into refactor-tags-widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/4adc7eba7f1d0140f7b79d6826d78c42c5ad03b0" target="_blank">4adc7eb</a> - Stanislav Monarshuk: Merge branch 'refactor-tags-widget-jeremy' into refactor-tags-widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/a20a3a75087bc1017d706eb0e633387d68708761" target="_blank">a20a3a7</a> - Stanislav Monarshuk: Moved common bar functions to BarButtonsHandlersMixin. Moved refresh button out of react components</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/27091572360ce350fb34673117dfe32fbc53f25b" target="_blank">2709157</a> - Stanislav Monarshuk: Added WidgetSearchBar. Added search to tags widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/99fb2ea101e3b9f119df7468fcd5f780b00c54a5" target="_blank">99fb2ea</a> - Serhii Yehorov: added column config, changed grid layout so that inifinite scroll could be impelemented, work in progress [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/3817095cd7f50b5e0aae26cdf4334d318d54f989" target="_blank">3817095</a> - Serhii Yehorov: resolved conflicts</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ea1f9c7b37df0ce3bf0bbdf4e6d958b2879a65f3" target="_blank">ea1f9c7</a> - Serhii Yehorov: fixed lint errors</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/336c5949029ca659f8944c6225ad90fa37bfed26" target="_blank">336c594</a> - Stanislav Monarshuk: Improved WidgetSearchBar functionality</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ca5962fcdf1bc12d755d81bae27bb9760dbb9d0b" target="_blank">ca5962f</a> - Stanislav Monarshuk: Merge branch 'refactor-tags-widget' of github.com:deseretdigital/common-cms-ui into refactor-tags-widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/1232e72ceb527616c4b98be39a56a0ba18128c93" target="_blank">1232e72</a> - Stanislav Monarshuk: Improved WidgetSearchBar functionality</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/334591e8d50beae11b5c61df314ff1e50d04ee2a" target="_blank">334591e</a> - Stanislav Monarshuk: Added Site field to Tags Widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/9579dca48807c01f0a44c52d78c582bc12817f88" target="_blank">9579dca</a> - Serhii Yehorov: work on grid and searchBar [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/605a9bf46d08727c01ac4fddfe656cf292d72ae3" target="_blank">605a9bf</a> - Stanislav Monarshuk: Implemented WidgetFilterPanel. Added Site filter to Tags Widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/c4f3671546955c289809ff3592c6f7452d1e882b" target="_blank">c4f3671</a> - Serhii Yehorov: resolved conflicts</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/42c80db7781de22d7752bd205b3b202ae3357ebf" target="_blank">42c80db</a> - Stanislav Monarshuk: Resolved conflict</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/60a7b22835bd431e9c872fd02459b1e718c3e15a" target="_blank">60a7b22</a> - Justin Carmony: Merge pull request #228 from deseretdigital/video-vimeo Changes to Video widget to support Vimeo videos [#89523218]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/c557be9d31d281137c2ffdff554c51228729c98b" target="_blank">c557be9</a> - Stanislav Monarshuk: Improved Tags widget filters, added collapse state</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/544054eec84db09417ad1e4ce4b5ce2704a13c17" target="_blank">544054e</a> - Justin Carmony: Merge pull request #224 from deseretdigital/pages-multiple-levels-of-inheritance Improved page inheritance</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/2f8d05340ec1201bd632d6ddba299ae2cba4aee2" target="_blank">2f8d053</a> - Justin Carmony: Merge pull request #230 from deseretdigital/media-name-credit Fixed missing name/credit info in grid of media widget [#88805384]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ef97d512412518957ff42a5702d52d0006ab2f18" target="_blank">ef97d51</a> - Justin Carmony: Merge pull request #226 from deseretdigital/add-story-content-type-to-rules enabled 'Story' content type in container rules [#89279852]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/43f71f6d266a97de23a9d3c24b89c9f77b665382" target="_blank">43f71f6</a> - Justin Carmony: Merge pull request #220 from deseretdigital/react React

                    </li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/d204548b3744d65f033e2fcea11235438c17adeb" target="_blank">d204548</a> - Justin Carmony: Merge pull request #223 from deseretdigital/inherited-containers-override-behaviour Pages: Once overridden, inherited containers should no longer inherit base page changes [#88666154]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/72d18045916f4f34ff30a38e446f25f732d5ade7" target="_blank">72d1804</a> - Matt Montgomery: Fixing case sensitivity issue</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/161f76e349757ccd90f99e9e2283e50671319dc7" target="_blank">161f76e</a> - Matt Montgomery: Whoops</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/0695b819b89ef6dbb5abfd4896e5663c4b08070e" target="_blank">0695b81</a> - Justin Carmony: Merge pull request #229 from deseretdigital/template-options Display page, container, and content template options [#89454854] [#89454952] [#89454898]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/0f6ad8321ea029fba6d6f132b626b06ed8d83430" target="_blank">0f6ad83</a> - Serhii Yehorov: implemented grid row deselection, small updates to grid functionality [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/48ff33e4a4dc1a15c32ac478bca22b8e3fbb630d" target="_blank">48ff33e</a> - Serhii Yehorov: Merge branch 'refactor-tags-widget' of github.com:deseretdigital/common-cms-ui into refactor-tags-widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/8fb78d3da7aadb47abaccd42d0ca0599ed1a971e" target="_blank">8fb78d3</a> - Stanislav Monarshuk: Added formatter to WidgetGrid component</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/1f289865b79391ac66e2ebb942e4f181913cbb01" target="_blank">1f28986</a> - Serhii Yehorov: resolved conflicts</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/968cfca4e73676f5933b5505dc2591265e8697d3" target="_blank">968cfca</a> - Stanislav Monarshuk: Added CookieUtilsMixin. Implemented saving filters to cookies in Site filter</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/64d605d47c58582d9203407a20a60740d6b3ae0d" target="_blank">64d605d</a> - Stanislav Monarshuk: Resolved conflict</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/b00f89bf1a46e55f6ea1ae1cea1c651654dcab68" target="_blank">b00f89b</a> - Serhii Yehorov: added WidgetTextarea and WidgetSubmitBtn components, added FormFieldsMixin, refactored part of form and form fields styles [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/b4a4baacdd162eadf1601f82d82818d2ef3c978a" target="_blank">b4a4baa</a> - Serhii Yehorov: resolved conflicts</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/680d15a56d6a226b9094af17d0525eac1b21f09c" target="_blank">680d15a</a> - Serhii Yehorov: small tweaks to SiteFilter, moved generic search and filter functionality to Grid component [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/cdc9d48991f618dedfa518499652444e34e062e6" target="_blank">cdc9d48</a> - Serhii Yehorov: separated collapser functionality into it's own component, removed Form namespace from fields [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/b144406f6db6464313072c138527689b207e8f3e" target="_blank">b144406</a> - Serhii Yehorov: changed letter case for JSXTransformer [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/53c7928821e9bf836fae6f1ac3b43feaf7ac160a" target="_blank">53c7928</a> - Serhii Yehorov: added react Tag widget to dropdown [#89015614]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/372eb27f519db9bed4294b0d77df7548340954eb" target="_blank">372eb27</a> - Serhii Yehorov: added key to site filter items [#89015636]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/747232e9813256ae303a0bfea2a724bd1ab26553" target="_blank">747232e</a> - Stanislav Monarshuk: Added MediaEdit, TabPanel react components</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/6d8a049d865c4cd6b536eef3e9f119778b1badfa" target="_blank">6d8a049</a> - Stanislav Monarshuk: Resolved conflict</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/99107d7eb2a54d45a435033acf2de62035762af1" target="_blank">99107d7</a> - Matt Montgomery: Very basic documentation of UI testing</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/a48e7bc9b3fbe6bdda4d79ca24317369db59217f" target="_blank">a48e7bc</a> - Matt Montgomery: Fixing breaking bugs</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/4e46aadf24c55361d89ac78e20ced6bdfe72b1da" target="_blank">4e46aad</a> - Matt Montgomery: Fixed another breaking change</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/e93f13c3091e4137e6c8728d6cecc6a60a36db48" target="_blank">e93f13c</a> - Serhii Yehorov: refactored grid and related components to operate on models instead of raw objects [#90020060]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/35f1d5890337c075e1354a3bf9740fd3e843a852" target="_blank">35f1d58</a> - Serhii Yehorov: refactored tabs styles [#90020060]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/7f74384ddbeb9111c625c6bda5dca3ddbc967e4e" target="_blank">7f74384</a> - Stanislav Monarshuk: Passing model to MediaEditWidget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/3a6e6717c956835c5b7c21354262807416cd308b" target="_blank">3a6e671</a> - Stanislav Monarshuk: Merge branch 'refactor-media-edit-widget' of github.com:deseretdigital/common-cms-ui into refactor-media-edit-widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/c217890fa503284296bb97a384be2b1605ead877" target="_blank">c217890</a> - Serhii Yehorov: added actual tabs styles folder [#90020060]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/d1aa677d726efd7714e68f32669863bd084e3c61" target="_blank">d1aa677</a> - Stanislav Monarshuk: Added datetime field to Media Edit details</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/81f2d8362fc3b3988b5fe73a5e1d08412c3c446e" target="_blank">81f2d83</a> - Stanislav Monarshuk: Added WidgetView. Added other info details to Media Edit widget</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/ec0a60a058fd0db97a0224b1cda25f7aef0136bb" target="_blank">ec0a60a</a> - Justin Carmony: Merge pull request #234 from deseretdigital/refactor-tags-widget Refactor tags widget [#89015614] [#89015636]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/100398043e4bf124bf5ed6c9b54c5b4343844c3c" target="_blank">1003980</a> - Justin Carmony: Disabling spawning the new widget for merge</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/fc0e905ad4aedb61699dc1610a683521e0786cc6" target="_blank">fc0e905</a> - Justin Carmony: Merge pull request #237 from deseretdigital/refactor-media-edit-widget Refactor media edit widget [#90020060]</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/47e0a810286f5b2a65414eaaeeb32cd6b98a69b6" target="_blank">47e0a81</a> - Justin Carmony: Catching up to master</li>

                    <li><a href="https://github.com/deseretdigital/common-cms-ui/commit/3d4d7fc98c02eee69c42575a0f711250f7ac4866" target="_blank">3d4d7fc</a> - Justin Carmony: Merge pull request #222 from deseretdigital/edit-meta-page-title Edit meta page title [#88665610]</li>

                </ul>
            </div>
        </div>

        <div class="commitList">
            <div class="commitListInside">
                <h3>Repo: common-cms-public (0) [<a class="toggle" data-toggle="masterCommitList_common-cms-public" href="#">view commits</a>]</h3>
                <ul id="masterCommitList_common-cms-public" style="display:none;">

                </ul>
            </div>
        </div>

    </div>
</div>
*/