import React, { Component } from 'react';
import Header from '../ui/Header';
import { FormGroup, Button, FormControl } from "react-bootstrap";

export default class RaidInsert extends Component
{
    componentDidMount = () => {

    }

    render() {
        return (
            <div className="raid-insert">
                Latitude: {this.props.match.params.lat}<br />
                Longitude: {this.props.match.params.lng}
            </div>
        );
    }
}
