import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from './Components/Index/App';
import Session from './Components/Pages/Session';
import SessionDetail from './Components/Pages/SessionDetail';
import FullLeaderboard from './Components/Pages/FullLeaderboard';
import Login from './Components/Private/Login';
import ServerLeaderboard from './Components/Pages/ServerLeaderboard';
import ServerDetail from './Components/Pages/ServerDetail';
import Dashboard from './Components/Private/Dashboard';
import './i18n';

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

ReactDOM.render(
  <React.StrictMode>
    <section id="particleJS">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <App />} />
          <Route exact path="/session/:id" component={() => <Session />} />
          <Route exact path="/session/:id/:driver" component={() => <SessionDetail />} />
          <Route exact path="/fullLeaderboard/:track" component={() => <FullLeaderboard />} />
          <Route exact path="/login" component={() => <Login />} />
          <Route exact path="/dashboard" component={() => <Dashboard />} />
          <Route exact path="/serverLeaderboard/:server/:track" component={() => <ServerLeaderboard />} />
          <Route exact path="/serverDetail/:server/:track/:driver" component={() => <ServerDetail />} />
          <App />
        </Switch>
      </Router>
    </section>
  </React.StrictMode>,
  document.getElementById('root')
);
