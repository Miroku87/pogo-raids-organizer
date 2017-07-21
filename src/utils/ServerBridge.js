import 'whatwg-fetch';

const
    RAID_SERVER_URL = 'http://localhost:9000/';

export default class ServerBridge
{
    static callback = ( json, success, error ) =>
    {
        if ( json.status === "ok" && typeof success === "function" )
            success( json );
        else if ( json.status === "error" && typeof error === "function" )
            error( json.message );
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
            .then( ( json ) =>
            {
                ServerBridge.callback( json, success, error )
            });
    }

    static getRaidInfo = ( raid_id, success, error ) =>
    {
        fetch( RAID_SERVER_URL + "?action=get&what=raidinfo&raid_id=" + raid_id, {
            method: "GET"
        } )
            .then( function ( response )
            {
                return response.json();
            } )
            .then(( json ) =>
            {
                ServerBridge.callback( json, success, error )
            } );
    }

    static setPartecipation = ( raid_id, user_id, success, error ) =>
    {
        fetch( RAID_SERVER_URL + "?action=insert&what=raidpartecipation&raid_id=" + raid_id + "&user_id=" + user_id, {
            method: "GET"
        } )
            .then( function ( response )
            {
                return response.json();
            } )
            .then(( json ) =>
            {
                ServerBridge.callback( json, success, error )
            } );
    }

    static removePartecipation = ( raid_id, user_id, success, error ) =>
    {
        fetch( RAID_SERVER_URL + "?action=remove&what=raidpartecipation&raid_id=" + raid_id + "&user_id=" + user_id, {
            method: "GET"
        } )
            .then( function ( response )
            {
                return response.json();
            } )
            .then(( json ) =>
            {
                ServerBridge.callback( json, success, error )
            } );
    }

    static getUserPartecipates = ( user_id, raid_id, success, error ) =>
    {
        fetch( RAID_SERVER_URL + "?action=get&what=userpartecipates&raid_id=" + raid_id + "&user_id=" + user_id, {
            method: "GET"
        } )
            .then( function ( response )
            {
                return response.json();
            } )
            .then(( json ) =>
            {
                ServerBridge.callback( json, success, error )
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
            .then( ( json ) =>
            {
                ServerBridge.callback( json, success, error )
            });
    }
}