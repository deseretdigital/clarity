var React = require('react');
var moment = require('moment');

var PullReq = React.createClass({
    render: function(){
        //console.log("PullReq#render this.props", this.props);
        var pullReq = this.props.pullReq;

        var repo = pullReq.head.repo.name;
        var url = pullReq.html_url;
        var number = pullReq.number;
        var title = pullReq.title;
        var created = moment(pullReq.created_at).fromNow();
        var updated = moment(pullReq.updated_at).fromNow();

        var aheadBehindBar = '';
        var summaryDetails = '';
        if(!pullReq.diff)
        {
            summaryDetails = <div className="loading">Loading Additional Details</div>;
        }
        else
        {
            //console.log('PullReq#render pullReq.diff', pullReq.diff);
            summaryDetails = (
                <div className="pull-request-branch__summary-details">
                   <p className="when"><strong>Updated:</strong> {updated} <strong>Created:</strong> {created}</p>
                    <p className="authors">
                        <strong>Authors:</strong> {pullReq.diff.authors.join(', ')}
                    </p>
                    <p className="changes"><strong>Changes:</strong> <span className="additions">+{pullReq.diff.additions}</span> <span className="deletions">-{pullReq.diff.deletions}</span> | <span className="commits">{pullReq.diff.totalCommits} commits</span> | <span className="files">{pullReq.diff.files.length} files</span></p>
                    <p className="status"><strong>Status:</strong> {pullReq.diff.status} <span className="behindBy"><strong>Behind:</strong> -{pullReq.diff.behindBy} commits</span> <span className="aheadBy"><strong>Ahead:</strong> +{pullReq.diff.aheadBy} commits</span></p>
                </div>
            );


            var aheadBehindStats = this.props.aheadBehindStats;
            var behindBar = Math.ceil((pullReq.diff.behindBy / aheadBehindStats.mostBehind) * 100);
            var aheadBar = Math.ceil((pullReq.diff.aheadBy / aheadBehindStats.mostAhead) * 100);



            aheadBehindBar = (
                <div className="aheadBehindBar">
                    <div className="behind">
                        <div className="current" style={{width: behindBar + "%"}}></div>
                    </div>
                    <div className="ahead">
                        <div className="current" style={{width: aheadBar + "%"}}></div>
                    </div>
                </div>
            );
        }



        return (
            <div className="pull-request-branch">
                <div className="pull-request-branch__main">
                    <div className="pull-request-branch__title">
                        {repo}: <a href={url} target="_blank">#{number} - {title}</a>
                    </div>
                    <div className="pull-request-branch__summary">
                       {summaryDetails}
                    </div>
                </div>
                {aheadBehindBar}
            </div>
        );
    }
});

module.exports = PullReq;
