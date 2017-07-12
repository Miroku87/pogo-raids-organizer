import React, { Component } from 'react';
import PositionWatcher from '../../utils/PositionWatcher';
 
import Header from '../header/Header';
import RaidMap from '../google-maps/RaidMap';
import './Home.css';

export default class Home extends Component
{
    constructor( props )
    {
        super(props);
        this._geo_id = null;
    }

    positionNotFound = ( err ) => 
    {
        console.log( err );
    }

    positionUpdate = ( position ) =>
    {
        this.map.setState({
            center: {
                lat: position.coords.latitude, lng: position.coords.longitude
            }
        });
    }

    componentDidMount = () =>
    {
        let positionWatcher = new PositionWatcher();
        positionWatcher.addListener(PositionWatcher.POSITION_UPDATE, this.positionUpdate);
        positionWatcher.addListener(PositionWatcher.POSITION_NOT_FOUND, this.positionNotFound);
    }

    componentWillUnmount = () =>
    {
    }

    render() {
        return (
            <div className="App">
                <Header
                    title="PoGo Raid Organizer"
                    search_placeholder="Livello o pok&eacute;mon"
                    search_action="Filtra"
                />
                <RaidMap
                    ref={(map) => { this.map = map; } }
                />
            </div>
        );
    }
}
