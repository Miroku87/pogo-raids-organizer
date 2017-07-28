import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { Glyphicon } from 'react-bootstrap';
import { ButtonGoToHistory } from "../ui/ButtonGoTo";
import Countdown from "../ui/Countdown";
import ServerBridge from "../../utils/ServerBridge";

import "./RaidMap.css";

const
    MILAN_COORDINATES = { lat: 45.464218, lng: 9.1881625 },
    RAID_INSERT_URL = '/raid_insert/{LATITUDE}/{LONGITUDE}';
/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
const Map = withGoogleMap( props => (
    <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={props.mapZoom}
        defaultCenter={MILAN_COORDINATES}
        center={props.center}
        onClick={props.onMapClick}
        defaultOptions={{ clickableIcons: false }}
    >
        {props.infoPosition && (
            <InfoWindow
                position={props.infoPosition}
                onCloseClick={props.onInfoCloseClick}
                options={{ maxWidth: 170 }}
            >
                <div className="info-content">
                    <ButtonGoToHistory goto={props.newRaidGoTo}>Nuovo Raid Qui</ButtonGoToHistory><br /><br />
                    Oppure clicca un altro punto
                </div>
            </InfoWindow>
        )}
        {props.markers.map(( marker, index ) =>
        {
            const
                onClick = () => props.onMarkerClick( marker ),
                onCloseClick = () => props.onMarkerInfoCloseClick( marker ),
                count_to = marker.start_time_elapsed ? marker.end_time : marker.start_time,
                raid_url = "/raid_info/" + marker.key;

            return (
                <Marker
                    key={marker.key}
                    position={marker.position}
                    title={( index + 1 ).toString()}
                    onClick={onClick}
                >
                    {marker.showInfo && (
                        <InfoWindow onCloseClick={onCloseClick}>
                            <div className="raid-info-win">
                                <h4>{( new Array( parseInt( marker.level, 10 ) + 1 ).fill( 1 ) ).map(( e, i ) => { return ( <Glyphicon key={i} glyph="star" /> ); } )}</h4> 
                                ~ <Countdown countTo={new Date( count_to )} /><br /><br />
                                <ButtonGoToHistory
                                    bsStyle="primary"
                                    bsSize="xsmall"
                                    goto={raid_url}
                                >
                                    Dettagli
                                </ButtonGoToHistory>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            );
        } )}
    </GoogleMap>
) );

export default class RaidMap extends Component
{
    constructor( props )
    {
        super( props );

        this.state = {
            markers: [],
            info_position: null,
            new_raid_goto: null,
            zoom: 16
        };
        
    }

    componentDidMount()
    {
        ServerBridge.clearShowedRaidsSession();

        if ( !this.props.mapCenter )
            return false;

        this.showInfoPopup( this.props.mapCenter );
    }

    componentWillReceiveProps( nextProps )
    {
        this.showInfoPopup( nextProps.mapCenter );
    }

    setMarkers = ( data ) => 
    {
        let new_markers = [],
            old_markers = [],
            bounds = this.getBounds( this._mapComponent );

        data.raids.forEach( ( r ) =>
        {
            new_markers.push( {
                key: r.raid_id,
                level: r.raid_level,
                pokemon: r.raid_pokemon,
                start_time: r.raid_start_time,
                start_time_elapsed: r.raid_start_time_elapsed === "1",
                end_time: r.raid_end_time,
                position: {
                    lat: parseFloat( r.raid_latitude ),
                    lng: parseFloat( r.raid_longitude )
                }
            } );
        } );


        old_markers = this.state.markers.filter(( m ) =>
        {
            return m.position.lat > bounds[0] && m.position.lng > bounds[1] && m.position.lat < bounds[2] && m.position.lng < bounds[3];
        } );

        this.setState( {
            markers: new_markers.concat( old_markers )
        } );
    }

    getBounds = ( map ) =>
    {
        if ( !map || !map.getBounds() )
            return null;

        let lat2 = map.getBounds().getNorthEast().lat(),
            lon2 = map.getBounds().getNorthEast().lng(),
            lat1 = map.getBounds().getSouthWest().lat(),
            lon1 = map.getBounds().getSouthWest().lng();

        return [ lat1, lon1, lat2, lon2 ];
    }

    handleMapLoad = ( map ) =>
    {
        this._mapComponent = map;

        if ( !this._mapComponent )
            return false;

        window.google.maps.event.addListener( this._mapComponent.context["__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"], 'idle', ( event ) =>
        {
            let bounds = this.getBounds( this._mapComponent );

            if( bounds )
                ServerBridge.getRaids( bounds, this.setMarkers );
        } );
    }

    handleMapClick = ( event ) =>
    {
        this.showInfoPopup( { lat: event.latLng.lat(), lng: event.latLng.lng() } );
    }

    handleMarkerClick = ( targetMarker ) =>
    {
        this.setState( {
            markers: this.state.markers.map( marker =>
            {
                if ( marker === targetMarker )
                {
                    return {
                        ...marker,
                        showInfo: true
                    };
                }
                else
                {
                    return {
                        ...marker,
                        showInfo: false
                    };
                }
                return marker;
            } ),
            info_position: null 
        } );
    }

    handleMarkerInfoCloseClick = ( targetMarker ) =>
    {
        this.setState( {
            markers: this.state.markers.map( marker =>
            {
                if ( marker === targetMarker )
                {
                    return {
                        ...marker,
                        showInfo: false,
                    };
                }
                return marker;
            } ),
        } );
    }

    showInfoPopup = ( coordinates ) =>
    {
        this.setState( {
            info_position: coordinates,
            new_raid_goto: RAID_INSERT_URL.replace( /\{LATITUDE\}/g, coordinates.lat ).replace( /\{LONGITUDE\}/g, coordinates.lng )
        } );
    }

    handleInfoClose = ( event ) =>
    {
        this.setState( {
            info_position: null,
            new_raid_goto: ''
        } );
    }

    render()
    {
        return (
            <div className="raid-map">
                <Map
                    containerElement={(<div style={{ height: "100%" }} />)}
                    mapElement={(<div style={{ height: "100%" }} />)}
                    center={this.props.mapCenter}
                    markers={this.state.markers}
                    infoPosition={this.state.info_position}
                    newRaidGoTo={this.state.new_raid_goto}
                    mapZoom={this.state.zoom}
                    onInfoCloseClick={this.handleInfoClose}
                    onMapLoad={this.handleMapLoad}
                    onMapClick={this.handleMapClick}
                    onMarkerClick={this.handleMarkerClick}
                    onMarkerInfoCloseClick={this.handleMarkerInfoCloseClick}
                />
            </div>
        );
    }
}