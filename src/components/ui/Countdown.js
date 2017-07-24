import React, { Component } from 'react';

export default class Countdown extends Component
{
    constructor(props)
    {
        super( props );

        this.state = {
            hours: '00',
            minutes: '00',
            seconds: '00'
        };
    }

    componentDidMount = () =>
    {
        this.now = ( new Date() ).getTime();
        this.timer_id = setInterval( this.updateTimer, 1000 );
    }

    componentWillUnmount()
    {
        clearInterval( this.timer_id );
    }

    msToTime( duration )
    {
        var milliseconds = parseInt(( duration % 1000 ) / 100, 10 ),
            seconds = parseInt(( duration / 1000 ) % 60, 10 ),
            minutes = parseInt(( duration / ( 1000 * 60 ) ) % 60, 10 ),
            hours = parseInt(( duration / ( 1000 * 60 * 60 ) ) % 24, 10 );

        hours = ( hours < 10 ) ? "0" + hours : hours;
        minutes = ( minutes < 10 ) ? "0" + minutes : minutes;
        seconds = ( seconds < 10 ) ? "0" + seconds : seconds;

        return { H: hours, M: minutes, S: seconds, I: milliseconds };
    }

    updateTimer = () =>
    {
        this.now = ( new Date() ).getTime();
        var difference = this.props.countTo.getTime() - this.now,
            formatted = this.msToTime( difference ); 

        this.setState( {
            hours: formatted.H,
            minutes: formatted.M,
            seconds: formatted.S
        } );
    }

    render()
    {
        return (
            <span className="countdown">
                {this.state.hours}:{this.state.minutes}:{this.state.seconds}
            </span>
        );
    }
}
