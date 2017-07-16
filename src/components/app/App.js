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
    constructor(props)
    {
        super(props);
        this.state = {
            map_center: null
        }
    }

    positionNotFound = ( err ) => 
    {
        console.log( err );
    }

    positionUpdate = ( position ) =>
    {
        let position_obj = {
            lat: position.coords.latitude, lng: position.coords.longitude
        };

        console.log("positionUpdate");
        this.setState({
            map_center: position_obj
        });

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

        console.log(this.state.map_center);

        if(this.state.map_center)
            this.map.showInfoPopup( this.state.map_center );
    }

    componentWillUnmount = () =>
    {
        this.positionWatcher.stopWatching();
    };

    render()
    {
        return (
            <Router>
                <div className="app">
                    <Header
                        title="PoGo Raid Organizer"
                        search_placeholder="Livello o pok&eacute;mon"
                        search_action="Filtra"
                    />
                    <Route exact path="/" render={props => (
                        <RaidMap
                            ref={( map ) => { this.map = map; }}
                            mapCenter={this.state.map_center}
                            {...props} />
                    )} />
                    <Route path="/raid_insert/:lat/:lng" component={RaidInsert} />
                    <Route path="/raid_chat/:id" component={RaidChat} />
                    <Route path="/raid_info/:id" component={RaidInfo} />
                </div>
            </Router>
        );
    }
}
