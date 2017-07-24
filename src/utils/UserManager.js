import ServerBridge from "./ServerBridge";

let _data = {
        is_connected: false,
        user_id: 0,
        friends: [],
        picture_url: '',
        name: '',
        short_name: '',
        partecipations: null
    },
    _eventHandlers = {
        userConnection: [],
        partecipationsReady: []
    },
    _data_retrieved = false;

export default class UserManager 
{
    static get dataHasBeenRetrieved()
    {
        return _data_retrieved;
    }

    static get userData()
    {
        return _data;
    }

    static addEventListener = ( event, handler ) =>
    {
        _eventHandlers[event].push( handler );
    }

    static removeEventListener = ( event, handler ) =>
    {
        _eventHandlers[event].splice( _eventHandlers[event].indexOf( handler ), 1 );
    }

    static hasEventListener = ( event, handler ) =>
    {
        return _eventHandlers[event].indexOf( handler ) !== -1;
    }

    static getPartecipations = ( ) =>
    {
        ServerBridge.getUserPartecipations( _data.user_id, ( data ) =>
        {
            _data.partecipations = data.partecipations.map(( p ) => { return p.id_raid_partecipation; });
            _eventHandlers.partecipationsReady.forEach(( h ) => { h(); } );
        } );
    }

    static sendPartecipation = ( raid_id, success, error ) =>
    {
        ServerBridge.sendPartecipation( raid_id, _data.user_id, () =>
        {
            _data.partecipations.push( raid_id ); //in alternativa o ulteriormente, controllare il DB
            if ( typeof success === "function" ) success();
        },
        error );
    }

    static removePartecipation = ( raid_id, success, error ) =>
    {
        ServerBridge.removePartecipation( raid_id, _data.user_id, () =>
        {
            _data.partecipations.splice( _data.partecipations.indexOf( raid_id ), 1 ); //in alternativa o ulteriormente, controllare il DB
            if ( typeof success === "function" ) success();
        },
        error );
    }

    static userPartecipatesTo = ( raid_id ) =>
    {
        return _data.partecipations.indexOf( raid_id ) !== -1;
    }

    static checkFacebookLogin = ( force_login, success, error ) =>
    {
        if ( !window.FB && typeof error === "function" )
        {
            error( "You must initialize the Graph API SDK before calling this method." );
        }

        if ( _data.is_connected )
        {
            success();
            return true;
        }
        
        window.FB.getLoginStatus(( auth_res ) =>
        {
            if ( auth_res.authResponse )
            {
                _data.is_connected = true;
                _data.user_id = auth_res.authResponse.userID;

                UserManager.getPartecipations();

                window.FB.api( '/me', 'GET',
                    { "fields": "name,picture.height(100).width(100),email,first_name,friends.limit(1000)" },
                    ( info_res ) =>
                    {
                        _data.name = info_res.name;
                        _data.short_name = info_res.short_name;
                        _data.email = info_res.email;
                        _data.picture_url = info_res.picture.data.url;
                        _data.friends = info_res.friends;
                    } );

                success();
            }
            else if ( !auth_res.authResponse && force_login )
                window.FB.login(() => { UserManager.checkFacebookLogin( null, success, error ) }, { scope: 'public_profile,email,user_friends' } );
            else if ( !auth_res.authResponse && !force_login )
                success();

            _data_retrieved = true;
            _eventHandlers.userConnection.forEach(( h ) => { h(); } );
        } );
    }
}