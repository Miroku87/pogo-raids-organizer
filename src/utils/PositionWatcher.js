import EventEmitter from "./EventEmitter";

const can_use_dom = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

const geolocation = (
    can_use_dom && navigator.geolocation ?
        navigator.geolocation :
        ({
            watchPosition(success, failure) {
                failure(`Your browser doesn't support geolocation.`);
            },
            clearWatch() { }
        })
);

export default class PositionWatcher extends EventEmitter
{
    constructor(options) {
        super();

        let opts = options;

        if (typeof opts === 'undefined')
            opts = {};

        if (typeof opts.enableHighAccuracy === 'undefined')
            opts.enableHighAccuracy = true;

        this._geo_id = geolocation.watchPosition(this.positionSuccess, this.positionFailure, opts);
    }

    positionSuccess = (position) =>
    {
        this.emit(PositionWatcher.POSITION_UPDATE, position);
    }

    positionFailure = (err) =>
    {
        this.emit(PositionWatcher.POSITION_NOT_FOUND, err);
    }

    stopWatching = () => 
    {
        geolocation.clearWatch(this._geo_id);
    }
}

PositionWatcher.POSITION_UPDATE = "positionUpdate";
PositionWatcher.POSITION_NOT_FOUND = "positionNotFound";