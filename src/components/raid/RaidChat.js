import React, { Component } from 'react';
import { Alert, FormGroup, Button, FormControl } from "react-bootstrap";
import UserManager from '../../utils/UserManager';

import './RaidChat.css';

export default class RaidChat extends Component 
{
    constructor( props )
    {
        super( props );

        this.state = {
            user_allowed_to_chat: false
        };
    }

    componentDidMount = () => 
    {
        this.setState( {
            user_allowed_to_chat: UserManager.userData.is_connected && UserManager.userPartecipatesTo( this.props.match.params.id )
        } );
    }

    render() {
        return (
            <div className="raid-chat container">
                {!this.state.user_allowed_to_chat && (
                    <Alert bsStyle="danger">
                        <h4>Permessi Negati</h4>
                        <p>Non puoi unirti alla chat di un Raid al quale non parteciperai.</p>
                    </Alert>
                    )}
            </div>
        );
    }
}
