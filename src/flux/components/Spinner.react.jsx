var React = require('react');

var Spinner = React.createClass({
    getDefaultProps: function(){
        return {
            useProgress: false,
            progress: 0
        }
    },

    getInitialState: function(){
        return {

        };
    },
    render: function(){
        if(this.props.progress <= 0)
        {
            return <div></div>;
        }

        var progress = (this.props.progress >= 100) ? 99 : this.props.progress;

        var style = {
            width: progress + '%'
        }



        return (
            <div className="spinner">
                <h4>Loading</h4>
                <div className="meter">
                    <span style={style}></span>
                </div>
            </div>
        );
    }
});

module.exports = Spinner;
