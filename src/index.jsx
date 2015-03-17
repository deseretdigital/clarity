var React = require('react');
var Router = require('react-router');
var Promise = require('bluebird');

var routes = require('./flux/routes');


// Inject transaction and batching strategy (problem w/ Webpack maybe?)
require('react-raf-batching').inject();
require('react/lib/ReactUpdates').injection.injectReconcileTransaction(require('react/lib/ReactReconcileTransaction'));

if (typeof window !== 'undefined') {
    window.onload = function() {
        Router.run(routes, Router.HistoryLocation, function (Handler) {
            React.render(<Handler/>, document.getElementById('clarityApp'));
        });
    };
}