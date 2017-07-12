import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from '../home/Home.js';
import InsertRaid from '../raid/InsertRaid';
import RaidChat from '../raid/RaidChat';
import RaidInfo from '../raid/RaidInfo';
 
export default class App extends Component
{
    render() {
        return (
            <Router>
                <Route exact path="/" component={Home}>
                    <Route path="insert_raid" component={InsertRaid} />
                    <Route path="raid_chat/:id" component={RaidChat} />
                    <Route path="raid_info/:id" component={RaidInfo} />
                </Route>
            </Router>
        );
    }
}
