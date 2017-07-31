import React, { Component } from 'react';
import { Row, Col, ControlLabel } from "react-bootstrap";
import UserManager from '../../utils/UserManager';

import './RaidChatEntry.css';

export default class RaidChatEntry extends Component
{
    render()
    {
        let real_entry = null,
            entry_time = new Date(),
            entry_time_str = "";

        entry_time.setTime( this.props.date );
        entry_time_str = entry_time.toLocaleTimeString( 'it-IT' );

        if ( this.props.userID !== UserManager.userData.user_id )
            real_entry = (
                <Row className="show-grid chat-entry">
                    <Col sm={1} className="chat-user-col">
                        <img className="user-picture" src={this.props.userPictureUrl} alt={this.props.username} />
                    </Col>
                    <Col sm={11} className="chat-message-col">
                        <div className="chat-message-heading">
                            <span className="chat-username">{this.props.username} </span> 
                            <span className="chat-date">( {entry_time_str} )</span>
                        </div>
                        <div className="chat-message-body">
                            {this.props.message}
                        </div>
                    </Col>
                </Row> );
        else
            real_entry = (
                <Row className="show-grid chat-entry">
                    <Col sm={11} className="chat-message-col">
                        <div className="chat-message-heading">
                            <span className="chat-username">{this.props.username} </span> 
                            <span className="chat-date">( {entry_time_str} )</span>
                        </div>
                        <div className="chat-message-body">
                            {this.props.message}
                        </div>
                    </Col>
                    <Col sm={1} className="chat-user-col">
                        <img className="user-picture" src={this.props.userPictureUrl} alt={this.props.username} />
                    </Col>
                </Row> );

        return real_entry;
    }
}