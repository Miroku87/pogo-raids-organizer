import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { ButtonGoToHistory } from "../ui/ButtonGoTo";
import "./RaidMap.css";

const MILAN_COORDINATES = { lat: 45.464218, lng: 9.1881625 };
/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
const Map = withGoogleMap(props => (
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
                onCloseClick={props.infoCloseHandler}
                options={{ maxWidth: 170 }}
            >
                <div className="info-content">
                    <ButtonGoToHistory goto={props.newRaidGoTo}>Nuovo Raid Qui</ButtonGoToHistory><br /><br />
                    Oppure clicca un altro punto
                </div>
            </InfoWindow>
        )}
        {props.markers.map(marker => (
            <Marker
                {...marker}
                onRightClick={() => props.onMarkerRightClick(marker)}
            />
        ))}
    </GoogleMap>
));

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

    showInfoPopup = ( coordinates ) =>
    {
        this.setState( {
            info_position: coordinates,
            new_raid_goto: '/raid_insert/' + coordinates.lat + "/" + coordinates.lng
        } );
    }

    handleMapLoad = ( map ) =>
    {
        this._mapComponent = map;
    }

    /*
     * This is called when you click on the map.
     * Go and try click now.
     */
    handleMapClick = ( event ) =>
    {
        /*const nextMarkers = [
         ...this.state.markers,
         {
         position: event.latLng,
         defaultAnimation: 2,
         key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
         },
         ];
         this.setState({
         markers: nextMarkers
         });*/

        this.showInfoPopup({ lat: event.latLng.lat(), lng: event.latLng.lng() } );
    }

    handleMarkerRightClick = ( targetMarker ) =>
    {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
        this.setState({
            markers: nextMarkers
        });
    }

    handleInfoClose = ( event ) =>
    {
        this.setState({
            info_position: null
        });
    }

    componentDidMount()
    {
        if(this.props.mapCenter)
            this.showInfoPopup( this.props.mapCenter );
    }

    componentWillReceiveProps(nextProps)
    {
        this.showInfoPopup( nextProps.mapCenter );
    }

    render()
    {
        return (
            <div className="raid-map">
                <Map
                    containerElement={
                        <div style={{ height: "100%" }} />
                        }
                    mapElement={
                        <div style={{ height: "100%" }} />
                        }
                    center={this.props.mapCenter}
                    markers={this.state.markers}
                    infoPosition={this.state.info_position || this.props.infoPopupPosition}
                    newRaidGoTo={this.state.new_raid_goto}
                    mapZoom={this.state.zoom}
                    infoCloseHandler={this.handleInfoClose}
                    onMapLoad={this.handleMapLoad}
                    onMapClick={this.handleMapClick}
                    onMarkerRightClick={this.handleMarkerRightClick}
                />
            </div>
        );
    }
}