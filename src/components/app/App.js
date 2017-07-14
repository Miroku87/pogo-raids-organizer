import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import RaidMap from '../raid/RaidMap';
import Header from '../ui/Header';
import RaidInsert from '../raid/RaidInsert';
import RaidChat from '../raid/RaidChat';
import RaidInfo from '../raid/RaidInfo';
import PositionWatcher from '../../utils/PositionWatcher';

import './App.css'; 

export default class App extends Component
{
    positionNotFound = ( err ) => 
    {
        console.log( err );
    }

   positionUpdate = ( position ) =>
    {
        let position_obj = {
            lat: position.coords.latitude, lng: position.coords.longitude
        };

        if ( this.map )
            this.map.setMapCenter( position_obj );

        if ( this.map && this.first_position_update !== false )
        {
            this.first_position_update = false;
            this.map.showInfoPopup( position_obj );
        }
    }

    componentDidMount = () =>
    {
        this.positionWatcher = new PositionWatcher();
        this.positionWatcher.addListener( PositionWatcher.POSITION_UPDATE, this.positionUpdate );
        this.positionWatcher.addListener( PositionWatcher.POSITION_NOT_FOUND, this.positionNotFound );
    }

    componentWillUnmount = () =>
    {
        this.positionWatcher.stopWatching();
    }

    render()
    {
        return (
            <Router forceRefresh={true}>
                <div className="app">
                    <Header
                        title="PoGo Raid Organizer"
                        search_placeholder="Livello o pok&eacute;mon"
                        search_action="Filtra"
                    />
                    <Route exact path="/" ref={( rm ) => { this.rm = rm; }} render={props => (
                        <RaidMap ref={( map ) => { this.map = map; }} {...props} />
                    )} />
                    <Route path="/raid_insert/:lat/:lng" component={RaidInsert} />
                    <Route path="/raid_chat/:id" component={RaidChat} />
                    <Route path="/raid_info/:id" component={RaidInfo} />
                </div>
            </Router>
        );
    }
}
