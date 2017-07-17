import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import RaidMap from '../raid/RaidMap';
import Header from '../ui/Header';
import RaidInsert from '../raid/RaidInsert';
import RaidChat from '../raid/RaidChat';
import RaidInfo from '../raid/RaidInfo';
import Help from './Help';
import PositionWatcher from '../../utils/PositionWatcher';

import './App.css'; 

export default class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            map_center: null,
            info_popup_position: null
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

        this.setState({
            map_center: position_obj
        });

        if ( this.first_position_update !== false )
        {
            this.first_position_update = false;
            this.setState( {
                info_popup_position: position_obj
            } );
        }
    }

    componentDidMount = () =>
    {
        this.positionWatcher = new PositionWatcher();
        this.positionWatcher.addListener( PositionWatcher.POSITION_UPDATE, this.positionUpdate );
        this.positionWatcher.addListener( PositionWatcher.POSITION_NOT_FOUND, this.positionNotFound );
        
        if ( this.state.map_center )
            this.setState( {
                info_popup_position: this.state.map_center
            } );
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
                            infoPopupPosition={this.state.info_popup_position}
                            {...props} />
                    )} />
                    <Route path="/raid_insert/:lat/:lng" component={RaidInsert} />
                    <Route path="/raid_chat/:id" component={RaidChat} />
                    <Route path="/raid_info/:id" component={RaidInfo} />
                    <Route path="/help" component={Help} />
                </div>
            </Router>
        );
    }
}
