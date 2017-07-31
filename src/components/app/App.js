import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import RaidMap from '../raid/RaidMap';
import Header from '../ui/Header';
import RaidInsert from '../raid/RaidInsert';
import RaidChat from '../raid/RaidChat';
import RaidInfo from '../raid/RaidInfo';
import Help from './Help';
import PositionWatcher from '../../utils/PositionWatcher';
import UserManager from '../../utils/UserManager';

import './App.css';

export default class App extends Component
{
    constructor( props )
    {
        super( props );
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

        this.setState( {
            map_center: position_obj
        } );
    }

    userLogged = () => 
    {

    }

    setupFacebookSDK = () =>
    {
        window.fbAsyncInit = () => 
        {
            window.FB.init( {
                appId: '324218624671234',
                cookie: true,
                xfbml: true,
                version: 'v2.8'
            } );
            window.FB.AppEvents.logPageView();

            UserManager.checkFacebookLogin( false, this.userLogged );
        };

        ( function ( d, s, id )
        {
            var js, fjs = d.getElementsByTagName( s )[0];
            if ( d.getElementById( id ) ) { return; }
            js = d.createElement( s ); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore( js, fjs );
        }( document, 'script', 'facebook-jssdk' ) );
    }

    setupPositionWatcher = () =>
    {
        this.positionWatcher = new PositionWatcher();
        this.positionWatcher.addListener( PositionWatcher.POSITION_UPDATE, this.positionUpdate );
        this.positionWatcher.addListener( PositionWatcher.POSITION_NOT_FOUND, this.positionNotFound );

        if ( this.state.map_center )
            this.setState( {
                info_popup_position: this.state.map_center
            } );
    }

    componentDidMount = () =>
    {
        this.setupPositionWatcher();
        this.setupFacebookSDK();
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
                    <Route path="/help" component={Help} />
                </div>
            </Router>
        );
    }
}
