var React = require('react');
var Router = require('react-router'); // or var Router = ReactRouter; in browsers

var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var AppController = require('./controllers/AppController.react');
var HomeController = require('./controllers/HomeController.react');
var TeamController = require('./controllers/TeamController.react');
var TeamOverviewController = require('./controllers/TeamOverviewController.react');
var TeamProjectController = require('./controllers/TeamProjectController.react');

var routes = (
  <Route handler={AppController} path="/">
    <DefaultRoute name="home" handler={HomeController} />
    <Route name="team" path="team/:teamName" handler={TeamController}>
      <DefaultRoute name="team-overview" handler={TeamOverviewController} />
      <Route name="team-project" path="project/:projectName" handler={TeamProjectController} />
    </Route>
  </Route>
);

/* <Route name="about" handler={About} />
    <Route name="users" handler={Users}>
      <Route name="recent-users" path="recent" handler={RecentUsers} />
      <Route name="user" path="/user/:userId" handler={User} />
      <NotFoundRoute handler={UserRouteNotFound}/>
    </Route>
    <NotFoundRoute handler={NotFound}/>
    <Redirect from="company" to="about" /> */

module.exports = routes;