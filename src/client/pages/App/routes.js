import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from 'Pages/Login';
import Register from 'Pages/Register';
import Home from 'Pages/Home';
import RequireAuth from 'Components/RequireAuth';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={RequireAuth(Home)} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
  </Switch>
);

export default Routes;
