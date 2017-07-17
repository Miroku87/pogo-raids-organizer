import EventEmitter from "./EventEmitter";
import 'whatwg-fetch';

export default class ServerBridge extends EventEmitter
{
    constructor( options )
    {
        super();
    }

    getNearbyRaids = ( ) =>
    {
        console.log( "getNearbyRaids Simulation: " );
    }

    sendData = ( data ) =>
    {
        console.log( "Send Data Simulation: ", data );
    }
}