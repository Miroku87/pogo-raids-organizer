import React, { Component } from 'react';
import { Panel, Grid, Row, Col, Button, ControlLabel } from "react-bootstrap";
import PopUp from '../ui/PopUp';
import Countdown from "../ui/Countdown";
import { ButtonGoToHistory } from "../ui/ButtonGoTo";
import ServerBridge from '../../utils/ServerBridge';
import UserManager from '../../utils/UserManager';

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
            rai_pokemon: "",
            partecipate_btn_enabled: false
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

    managePartecipateButton = ( ) =>
    {
        if ( UserManager.userData.is_connected )
            this.setState( {
                user_partecipates: UserManager.userPartecipatesTo( this.props.match.params.id ),
                partecipate_btn_enabled: true
            } );
    }

    getPartecipations = () =>
    {
        if ( UserManager.userData.partecipations === null && !UserManager.hasEventListener( "partecipationsReady", this.managePartecipateButton ) )
            UserManager.addEventListener( "partecipationsReady", this.managePartecipateButton );
        else if ( UserManager.userData.partecipations !== null )
            this.managePartecipateButton();
    }

    partecipate = ( ) =>
    {
        if ( UserManager.userData.is_connected )
            UserManager.sendPartecipation( this.props.match.params.id, this.getPartecipations );
    }

    leave = ( ) => 
    {
        if ( UserManager.userData.is_connected )
            UserManager.removePartecipation( this.props.match.params.id, this.getPartecipations );
    }

    onPartecipateBtnClick = ( e ) => 
    {
        this.setState( {
            partecipate_btn_enabled: false
        } );
        UserManager.checkFacebookLogin( e !== null, this.partecipate );
    }

    onLeaveBtnClick = ( e ) => 
    {
        this.setState( {
            partecipate_btn_enabled: false
        } );
        UserManager.checkFacebookLogin( e !== null, this.leave );
    }

    componentDidMount()
    {
        ServerBridge.getRaidInfo( this.props.match.params.id, this.setInfo );
        this.getPartecipations( );
    }

    render()
    {
        return (
            <div className="raid-info container">
                <PopUp
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
                            <Button onClick={this.onPartecipateBtnClick} bsStyle="info" disabled={!this.state.partecipate_btn_enabled}>Partecipa al Raid</Button>
                        )
                        }
                        {this.state.user_partecipates && (
                            <div>
                                <Button onClick={this.onLeaveBtnClick} bsStyle="danger">Lascia il Raid</Button>
                                <br />
                                <ButtonGoToHistory goto={'/raid_chat/' + this.props.match.params.id} bsStyle="info">Raid Chat</ButtonGoToHistory>
                            </div>
                        )
                        }
                    </div>
                </Panel>
            </div>

        );
    }
}
