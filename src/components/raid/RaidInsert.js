import React, { Component } from 'react';
import Header from '../ui/Header';
import { FormGroup, Button, FormControl } from "react-bootstrap";

export default class RaidInsert extends Component
{
    componentDidMount = () => {
        console.log(this.props.match);
    }

    render() {
        return (
            <div className="raid-insert">Latitude: {this.props.match.params.lat}<br />Longitude: {this.props.match.params.lng}</div>
        );
    }
}
