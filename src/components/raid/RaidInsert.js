import React, { Component } from 'react';
import { Panel, Form, ControlLabel, Col, FormGroup, Button, FormControl, Checkbox } from "react-bootstrap";
import Header from '../ui/Header';
import Alert from '../ui/Alert';
import ServerBridge from '../../utils/ServerBridge';
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
            alert_show: false,
            alert_title: "",
            alert_message: "",
            alert_html_message: "",
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
            if ( parseInt( value ) > target.max )
                value = target.max;
            else if ( parseInt( value ) < target.min )
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
        let { raid_already_started, ...data } = this.state;
        data.lat = this.props.match.params.lat;
        data.lon = this.props.match.params.lng;

        if ( data.raidStartTime === "" && data.raidCountdown === "" )
        {
            this.showError( <span>Almeno un campo tra <code>Orario di Inizio</code> e <code>Minuti Rimanenti</code> deve essere compilato.</span> );
            return false;
        }

        if ( data.raidStartTime === "" && data.raidCountdown !== "" && data.raidPokemon === "" )
        {
            this.showError( <span>Se il raid &egrave; gi&agrave; iniziato inserire il nome del Pok&eacute;mon.</span> );
            return false;
        }

        ServerBridge.sendData( data, this.goToMap, this.showError );
    }

    showError = ( msg ) => 
    {
        let new_state = {
            alert_show: true,
            alert_title: "Errore",
            alert_message: '',
            alert_html_message: '',
            alert_style: "modal-heading-danger"
        };

        if ( typeof msg === "string" )
            new_state.alert_html_message = msg;
        else if ( typeof msg === "object" )
            new_state.alert_message = msg;

        this.setState( new_state);
    }

    hideAlert = () =>
    {
        this.setState( {
            alert_show: false,
            alert_title: "",
            alert_message: '',
            alert_html_message: '',
            alert_style: ""
        } );
    }
    
    render()
    {
        return (
            <div className="container">
                <Alert
                    show={this.state.alert_show}
                    bsStyle={this.state.alert_style}
                    title={this.state.alert_title}
                    message={this.state.alert_message}
                    htmlMessage={this.state.alert_html_message}
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
