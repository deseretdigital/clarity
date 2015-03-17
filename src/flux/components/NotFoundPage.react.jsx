var React = require('react');

var NotFoundPage = React.createClass({
    
    getDefaultProps: function(){
        return {
            
        };
    },
    
    getInitialState: function() {
        
    },
    componentDidMount: function() {
        //PageStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        
        //PageStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return (
            <div>Error: Page Not Found</div>
        );
    },
    _onChange: function() {
        //this.setState(this.loadPageData(this.state.pageId));
    }
});

module.exports = NotFoundPage;