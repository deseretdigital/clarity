var React = require('react');
var moment = require('moment');

var PullReq = React.createClass({
    render: function(){
        //console.log("PullReq#render this.props", this.props);
        var pullReq = this.props.pullReq;
        
        var repo = pullReq.head.repo.name; 
        var url = pullReq.url;
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
                <div>
                    <div className="authors"><strong>Authors:</strong> {pullReq.diff.authors.join(', ')}</div>
                    <div className="changes"><strong>Changes:</strong> <span className="additions">+{pullReq.diff.additions}</span> <span className="deletions">-{pullReq.diff.deletions}</span> | <span className="commits">{pullReq.diff.totalCommits} commits</span> | <span className="files">{pullReq.diff.files.length} files</span></div>
                    <div className="status"><strong>Status:</strong> {pullReq.diff.status} <span className="behindBy"><strong>Behind:</strong> -{pullReq.diff.behindBy} commits</span> <span className="aheadBy"><strong>Ahead:</strong> +{pullReq.diff.aheadBy} commits</span></div>
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
            //<div className="viewDetails"><a href="#" className="toggle" data-toggle="details-common-cms-266">view details</a></div>
        }



        return (
            <div className="prBranch">
                <div className="prbInside">
                    <h4>{repo}: <a href={url} target="_blank">#{number} - {title}</a></h4>
                    <div className="summary">
                       <div className="when"><strong>Updated:</strong> {updated} <strong>Created:</strong> {created}</div>
                       {summaryDetails}
                    </div>
                </div>
                {aheadBehindBar}
            </div> 
        );
    }
});

module.exports = PullReq;