import React, { Component } from 'react';
import Header from '../header/Header';
import RaidMap from '../google-maps/RaidMap';
import logo from '../../assets/logo.svg';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header
                    title="PoGo Raid Organizer" />
                <RaidMap />
            </div>
        );
    }
}

export default App;
