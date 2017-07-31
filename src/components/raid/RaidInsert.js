import React, { Component } from 'react';
import { Panel, Form, ControlLabel, Col, FormGroup, Button, FormControl, Checkbox } from "react-bootstrap";
import PopUp from '../ui/PopUp';
import ServerBridge from '../../utils/ServerBridge';
import TextsManager from '../../utils/TextsManager';
import UserManager from '../../utils/UserManager';
import 'whatwg-fetch';

import "./RaidInsert.css";

const RAID_POKEMONS = [
    null,
    [
        "Croconaw",
        "Quilava",
        "Bayleef",
        "Magikarp"
    ],
    [

        "Exeggutor",
        "Magmar",
        "Electabuzz",
        "Weezing",
        "Muk"
    ],
    [
        "Alakazam",
        "Flareon",
        "Jolteon",
        "Gengar",
        "Machamp",
        "Arcanine",
        "Vaporeon"
    ],
    [

        "Tyranitar",
        "Rhydon",
        "Charizard",
        "Venusaur",
        "Snorlax",
        "Blastoise",
        "Lapras"
    ],
    [

        "Articuno",
        "Zapdos",
        "Moltres",
        "Mewtwo",
        "Raikou",
        "Entei",
        "Suicune",
        "Lugia",
        "Ho-Oh",
        "Mew"]
];

export default class RaidInsert extends Component
{
    constructor( props )
    {
        super( props );

        this.state = {
            raid_already_started: false,
            popup_show: false,
            popup_title: "",
            popup_message: "",
            popup_html_message: "",
            raidLevel: 1,
            raidStartTime: "",
            raidCountdown: "",
            raidPokemon: ""
        }
    }

    onCheckBoxChange = ( { target } ) =>
    {
        var new_state = {
            raid_already_started: target.checked
        }

        if ( !target.checked )
        {
            new_state.raidCountdown = "";
            new_state.raidPokemon = "";
        }

        this.setState( new_state );
    }

    onInputChange = ( { target } ) =>
    {
        let settings = {},
            value = target.value;

        if ( target.max && target.min )
        {
            if ( parseInt( value, 10 ) > target.max )
                value = target.max;
            else if ( parseInt( value, 10 ) < target.min )
                value = target.min;
        }

        target.value = value;

        settings[target.id] = value;
        this.setState( settings );
    }

    goToMap = () =>
    {
        this.props.history.push( '/' );
    }

    sendRaidData = () =>
    {
        let { raid_already_started,  popup_show, popup_title, popup_message, popup_html_message, popup_style, ...data } = this.state;
        data.lat = this.props.match.params.lat;
        data.lon = this.props.match.params.lng;

        if ( data.raidStartTime === "" && data.raidCountdown === "" )
        {
            let error_str = TextsManager.getText( UserManager.userData.lang, "errors", "startTimeOrCountdownMissing" );
            this.showError( error_str );
            return false;
        }

        if ( data.raidStartTime === "" && data.raidCountdown !== "" && data.raidPokemon === "" )
        {
            let error_str = TextsManager.getText( UserManager.userData.lang, "errors", "missingPokeName" );
            this.showError( error_str );
            return false;
        }

        ServerBridge.insertRaid( data, this.goToMap, this.showError );
    }

    showError = ( msg ) => 
    {
        let new_state = {
            popup_show: true,
            popup_title: TextsManager.getText( UserManager.userData.lang, "labels", "errorTitle" ),
            popup_message: '',
            popup_html_message: '',
            popup_style: "modal-heading-danger"
        };

        if ( typeof msg === "string" && msg.indexOf( "@@" ) === 0 )
            new_state.popup_html_message = TextsManager.getText( UserManager.userData.lang, "errors", msg.substr( 2 ) );
        else if ( typeof msg === "string" && msg.indexOf( "@@" ) === -1 )
            new_state.popup_html_message = msg;
        else if ( typeof msg === "object" )
            new_state.popup_message = msg;

        this.setState( new_state);
    }

    hideAlert = () =>
    {
        this.setState( {
            popup_show: false,
            popup_title: "",
            popup_message: '',
            popup_html_message: '',
            popup_style: ""
        } );
    }
    
    render()
    {
        return (
            <div className="container">
                <PopUp
                    show={this.state.popup_show}
                    bsStyle={this.state.popup_style}
                    title={this.state.popup_title}
                    message={this.state.popup_message}
                    htmlMessage={this.state.popup_html_message}
                    onHide={this.hideAlert}
                />
                <Panel header="Inserisci le informazioni del Raid" bsStyle="success">
                    <Form horizontal>
                        <FormGroup controlId="raidLevel">
                            <Col componentClass={ControlLabel} sm={3}>
                                Livello
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="Livello Raid"
                                    defaultValue="1"
                                    value={this.state.raid_level}
                                    onChange={this.onInputChange}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="raidAlreadyStarted">
                            <Col componentClass={ControlLabel} sm={3}>
                                Gi&agrave; iniziato
                            </Col>
                            <Col sm={7}>
                                <Checkbox
                                    defaultChecked={false}
                                    onChange={this.onCheckBoxChange}
                                />
                            </Col>
                        </FormGroup>

                        {!this.state.raid_already_started && (
                            <FormGroup controlId="raidStartTime">
                                <Col componentClass={ControlLabel} sm={3}>
                                    Orario di Inizio
                                </Col>
                                <Col sm={7}>
                                    <FormControl
                                        type="time"
                                        placeholder="Orario di Inizio Raid"
                                        value={this.state.raid_start_time}
                                        onChange={this.onInputChange}
                                    />
                                </Col>
                            </FormGroup>
                        )}

                        {this.state.raid_already_started && (
                            <FormGroup controlId="raidCountdown">
                                <Col componentClass={ControlLabel} sm={3}>
                                    Minuti Rimanenti
                                </Col>
                                <Col sm={7}>
                                    <FormControl
                                        type="number"
                                        min="1"
                                        max="59"
                                        placeholder="Minuti Rimanenti Raid"
                                        value={this.state.raid_countdown}
                                        onChange={this.onInputChange}
                                    />
                                </Col>
                            </FormGroup>
                        )}

                        {this.state.raid_already_started && (
                            <FormGroup controlId="raidPokemon">
                                <Col componentClass={ControlLabel} sm={3}>
                                    Pok&eacute;mon
                            </Col>
                                <Col sm={7}>
                                    <FormControl
                                        componentClass="select"
                                        placeholder="select"
                                        onChange={this.onInputChange}
                                    >
                                        <option key={0} value=""> Seleziona un Pok&eacute;mon </option>
                                        {RAID_POKEMONS[this.state.raidLevel].map( mon => (
                                            <option key={mon} value={mon}> {mon} </option>
                                        ) )}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                        )}

                        <FormGroup>
                            <Col smOffset={3} sm={7}>
                                <Button onClick={this.sendRaidData}>
                                    Inserisci Raid
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Panel>
            </div>
        );
    }
}
