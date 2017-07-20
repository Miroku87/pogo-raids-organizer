import EventEmitter from "./EventEmitter";
import 'whatwg-fetch';

const
    RAID_SERVER_URL = 'http://localhost:9000/';

export default class ServerBridge extends EventEmitter
{
    constructor( options )
    {
        super();
    }

    static getRaids = ( coords_info, success, error ) =>
    {
        let coords = coords_info.join( "," );

        fetch( RAID_SERVER_URL + "?action=get&what=nearestraids&coords=" + coords, {
            method: "GET"
        } )
            .then( function ( response )
            {
                return response.json();
            } )
            .then(( json ) => 
            {
                if ( json.status === "ok" )
                    success( json.raids );
                else if ( json.status === "error" )
                    error( json.message );
            } );
    }

    static sendData = ( data, success, error ) =>
    {
        data.action = "insert";
        data.what = "raidinfo";
        data.clientTime = Math.round( new Date().getTime() / 1000 );
        
        fetch( RAID_SERVER_URL, {
            method: "POST",
            headers: {
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "json=" + encodeURIComponent( JSON.stringify( data ) )
        } )
            .then( function ( response )
            {
                return response.json();
            } )
            .then(( json ) => 
            {
                if ( json.status === "ok" )
                    success( json.raids );
                else if ( json.status === "error" )
                    error( json.message );
            } );
    }
}