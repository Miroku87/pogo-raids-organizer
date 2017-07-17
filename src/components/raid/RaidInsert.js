import React, { Component } from 'react';
import Header from '../ui/Header';
import { Panel, Form, ControlLabel, Col, FormGroup, Button, FormControl, Checkbox } from "react-bootstrap";
import ServerBridge from '../../utils/ServerBridge';

import "./RaidInsert.css";

export default class RaidInsert extends Component
{
    constructor( props )
    {
        super( props );

        this.state = {
            raid_already_started: false,
            raidLevel: 1,
            raidStartTime: "",
            raidCountdown: "",
            raidPokemon: ""
        }

        this.server_bridge = new ServerBridge();
    }

    onCheckBoxChange = ( { target } ) =>
    {
        this.setState( {
            raid_already_started: target.checked
        });
    }

    onInputChange = ( { target } ) =>
    {
        let settings = {};
        settings[target.id] = target.value;

        this.setState( settings );
    }

    sendRaidData = () =>
    {
       let { raid_already_started, ...data } = this.state;

       this.server_bridge.sendData( data );
    }

    //Latitude: {this.props.match.params.lat} <br />
    //Longitude: { this.props.match.params.lng }
    render()
    {
        return (
            <div className="container">
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
                                    Conto alla Rovescia
                                </Col>
                                <Col sm={7}>
                                    <FormControl
                                        type="time"
                                        placeholder="Conto alla Rovescia Raid"
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
                                        type="text"
                                        placeholder="Pok&eacute;mon"
                                        value={this.state.raid_pokemon}
                                        onChange={this.onInputChange}
                                    />
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
