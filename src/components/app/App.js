import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from '../home/Home';
import RaidInsert from '../raid/RaidInsert';
import RaidChat from '../raid/RaidChat';
import RaidInfo from '../raid/RaidInfo';

import './App.css';
 
export default class App extends Component
{
    render() {
        return (
            <Router>
                <div className="app">
                    <Route exact path="/" component={Home} />
                    <Route path="/raid_insert/:lat/:lng" component={RaidInsert} />
                    <Route path="/raid_chat/:id" component={RaidChat} />
                    <Route path="/raid_info/:id" component={RaidInfo} />
                </div>
            </Router>
        );
    }
}
