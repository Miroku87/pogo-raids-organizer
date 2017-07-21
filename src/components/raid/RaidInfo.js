import React, { Component } from 'react';
import { Panel, Grid, Row, Col, Button, ControlLabel } from "react-bootstrap";
import Alert from '../ui/Alert';
import Countdown from "../ui/Countdown";
import { ButtonGoToHistory } from "../ui/ButtonGoTo";
import ServerBridge from '../../utils/ServerBridge';

import "./RaidInfo.css";

export default class RaidInfo extends Component
{
    constructor( props )
    {
        super( props );

        this.state = {
            alert_show: false,
            alert_title: "",
            alert_message: "",
            alert_html_message: "",
            info: [
                { label: "Livello", value: 1 },
                { label: "Orario di Inizio", value: "" }
            ],
            user_partecipates: false,
            raid_end_time: "",
            raid_start_time_elapsed: false,
            rai_pokemon: ""
        }
    }

    setInfo = ( data ) =>
    {
        var raid = data.raids[0];

        this.setState( {
            info: [
                { label: "Livello", value: raid.raid_level },
                { label: "Orario di Inizio", value: raid.raid_start_time }
            ],
            raid_end_time: raid.raid_end_time,
            raid_start_time_elapsed: raid.raid_start_time_elapsed === "1",
            rai_pokemon: raid.raid_pokemon
        } );
    }

    checkFacebookLogin = ( callback, event ) =>
    {
        console.log( 0 );
        window.FB.getLoginStatus(( response ) =>
        {
            console.log( "checkFacebookLogin", response );
            if ( response.authResponse )
                callback( response.authResponse );
            else if ( !response.authResponse && event )
                window.FB.login(() => { this.checkFacebookLogin( callback ) }, { scope: 'public_profile,email,user_friends' } );
            else if ( !response.authResponse && !event )
                callback( null );
        } )
    }

    managePartecipateButton = ( data ) =>
    {
        this.setState( {
            user_partecipates: data.user_partecipates
        } );
    }

    checkPartecipation = ( auth_response ) =>
    {
        console.log( "checkPartecipation", auth_response );
        if ( auth_response )
            ServerBridge.getUserPartecipates( auth_response.userID, this.props.match.params.id, this.managePartecipateButton );
    }

    partecipate = ( auth_response ) =>
    {
        if ( auth_response )
            ServerBridge.setPartecipation( this.props.match.params.id, auth_response.userID, this.checkPartecipation );
    }

    leave = ( auth_response ) => 
    {
        if ( auth_response )
            ServerBridge.removePartecipation( this.props.match.params.id, auth_response.userID, this.checkPartecipation );
    }

    componentDidMount()
    {
        ServerBridge.getRaidInfo( this.props.match.params.id, this.setInfo );

        let check_count = 0,
            fb_check = setInterval(() =>
            {
                if ( check_count++ > 100 )
                {
                    clearInterval( fb_check );
                    return false;
                }

                if ( window.FB )
                {
                    this.checkFacebookLogin( this.checkPartecipation );
                    clearInterval( fb_check );
                }
            }, 50 );
    }

    render()
    {
        return (
            <div className="raid-info container">
                <Alert
                    show={this.state.alert_show}
                    bsStyle={this.state.alert_style}
                    title={this.state.alert_title}
                    message={this.state.alert_message}
                    htmlMessage={this.state.alert_html_message}
                    onHide={this.hideAlert}
                />
                <Panel header="Informazioni Raid" bsStyle="info">
                    <Grid>
                        {this.state.info.map(( elem, index ) => 
                        {
                            return (
                                <Row key={index} className="show-grid">
                                    <Col componentClass={ControlLabel} sm={3} dangerouslySetInnerHTML={{ __html: elem.label }} />
                                    <Col sm={8}>{elem.value}</Col>
                                </Row>
                            );
                        } )
                        }
                        <Row key="countdown" className="show-grid">
                            <Col componentClass={ControlLabel} sm={3} >Tempo Rimanente</Col>
                            <Col sm={8}>
                                ~ <Countdown countTo={new Date( this.state.raid_end_time )} />
                            </Col>
                        </Row>
                    </Grid>
                    <div className="button-group">
                        {!this.state.user_partecipates && (
                            <Button onClick={( e ) => { this.checkFacebookLogin( this.partecipate, e ); }} bsStyle="info">Partecipa al Raid</Button>
                        )
                        }
                        {this.state.user_partecipates && (
                            <Button onClick={( e ) => { this.checkFacebookLogin( this.leave, e ); }} bsStyle="danger">Lascia il Raid</Button>
                        )
                        }
                        <br />
                        <ButtonGoToHistory goto={'/raid_chat/' + this.props.match.params.id} bsStyle="info">Raid Chat</ButtonGoToHistory>
                    </div>
                </Panel>
            </div>

        );
    }
}
