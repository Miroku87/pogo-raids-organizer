// Credits to https://github.com/Flynsarmy/PHPWebSocket-Chat

import EventEmitter from './EventEmitter';

let callbacks = {},
    ws_url,
    conn;

export default class FancyWebSocket extends EventEmitter
{
    constructor( url )
    {
        super();

        ws_url = url;
        this.connect();
    }

    connect = () =>
    {
        if ( typeof ( window.MozWebSocket ) === 'function' )
            this.conn = new window.MozWebSocket( ws_url );
        else
            this.conn = new window.WebSocket( ws_url );

        // dispatch to the right handlers
        this.conn.onmessage = ( evt ) => { console.log(evt);this.emit( 'message', JSON.parse( evt.data ) ) };
        this.conn.onclose = () => { this.emit( 'close' ) };
        this.conn.onopen = () => { this.emit( 'open' ) };
    };

    send = ( type, data ) =>
    {
        this.conn.send( JSON.stringify( { type: type, data: data } ) );
        return this;
    };

    disconnect = () =>
    {
        this.conn.close();
    };
};