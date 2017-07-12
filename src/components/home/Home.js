import React, { Component } from 'react';
import PositionWatcher from '../../utils/PositionWatcher';
 
import Header from '../ui/Header';
import RaidMap from '../raid/RaidMap';
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
        this.positionWatcher = new PositionWatcher();
        this.positionWatcher.addListener(PositionWatcher.POSITION_UPDATE, this.positionUpdate);
        this.positionWatcher.addListener(PositionWatcher.POSITION_NOT_FOUND, this.positionNotFound);
    }

    componentWillUnmount = () =>
    {
        this.positionWatcher.stopWatching();
    }

    render() {
        return (
            <div className="home">
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
