import React, { Component } from 'react';
import { Alert, FormGroup, InputGroup, Button, FormControl, Grid } from "react-bootstrap";
import RaidChatEntry from './RaidChatEntry';
import TextInput from '../ui/TextInput';
import UserManager from '../../utils/UserManager';
import FancyWebSocket from '../../utils/FancyWebSocket';
import ServerBridge from "../../utils/ServerBridge";

import './RaidChat.css';
import logo from '../../assets/logo.png';

const
    SOCKET_SERVER_HOST = 'ws://127.0.0.1',
    SOCKET_SERVER_PORT = 9300;

export default class RaidChat extends Component 
{
    constructor( props )
    {
        super( props );

        this.state = {
            grant_received: false,
            user_allowed_to_chat: false,
            chat_entries: []
        };
    }

    onSocketConnectioOpen = () =>
    {
        this.addMessageToState( { username: "Sistema", user_picture_url: logo, message: "Connessione stabilita.", date: new Date().getTime() } );
    }

    onSocketConnectionClose = () =>
    {
        this.addMessageToState( { username: "Sistema", user_picture_url: logo, message: "Connessione persa.", date: new Date().getTime() } );
    }

    onSocketMessage = ( data ) => 
    {
        console.log(data);
        if ( data.type === "chatMessage" )
        {
            if ( data.data.username === "Sistema" )
                data.data.user_picture_url = logo;

            this.addMessageToState( data.data );
        }
    }

    sortChatMessagesByDate = ( a, b ) => 
    {
        return a.date - b.date;
    }

    addMessageToState = ( message_obj ) =>
    {
        let entries = [].concat( this.state.chat_entries );
        entries.push( message_obj );
        entries.sort( this.sortChatMessagesByDate );

        this.setState( {
            chat_entries: entries
        } );
    }

    updateChatGrants = () =>
    {
        this.setState( {
            user_allowed_to_chat: UserManager.userData.is_connected && UserManager.userPartecipatesTo( this.props.match.params.id ),
            grant_received: true
        } );

        if ( UserManager.userData.is_connected && UserManager.userPartecipatesTo( this.props.match.params.id ) )
            this.setSocket();
    }

    setSocket = () =>
    {
        console.log( "SET SOCKET" );
        this.socket = new FancyWebSocket( SOCKET_SERVER_HOST + ":" + SOCKET_SERVER_PORT );
        this.socket.addListener( "open", this.onSocketConnectioOpen );
        this.socket.addListener( "close", this.onSocketConnectionClose );
        this.socket.addListener( "message", this.onSocketMessage );
    }

    sendMessage = ( evt, text ) =>
    {
        if ( text !== null && text !== "" && !/^\s+$/.test( text ) )
        {
            let message_obj = {
                user_id: UserManager.userData.user_id,
                username: UserManager.userData.name,
                user_picture_url: UserManager.userData.picture_url,
                message: text,
                date: new Date().getTime()
            };

            this.addMessageToState( message_obj );
            this.socket.send( "chatMessage", message_obj );
        }
    }

    componentDidMount = () => 
    {
        console.log( "RaidChat, didmount" );
        if ( UserManager.userData.partecipations === null && !UserManager.hasEventListener( "partecipationsReady", this.managePartecipateButton ) )
            UserManager.addEventListener( "partecipationsReady", this.updateChatGrants );
        else if ( UserManager.userData.partecipations !== null )
            this.updateChatGrants();
    }

    render()
    {
        return (
            <div className="raid-chat container">
                {this.state.grant_received && !this.state.user_allowed_to_chat && (
                    <Alert bsStyle="danger">
                        <h4>Permessi Negati</h4>
                        <p>Non puoi unirti alla chat di un Raid al quale non parteciperai.</p>
                    </Alert>
                )}
                {this.state.grant_received && this.state.user_allowed_to_chat && (
                    <div className="raid-chat-body">
                        <Grid>
                            {this.state.chat_entries.map(( entry, index ) =>
                            {
                                return (
                                    <RaidChatEntry
                                        key={index}
                                        username={entry.username}
                                        userPictureUrl={entry.user_picture_url}
                                        message={entry.message}
                                        date={entry.date}
                                    /> );
                            } )
                            }
                        </Grid>
                        <TextInput onSubmit={this.sendMessage} />
                    </div>
                )}
            </div>
        );
    }
}
