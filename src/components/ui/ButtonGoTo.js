import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { Button } from "react-bootstrap";

export default class ButtonGoTo extends Component 
{
    clickHandler = ( event ) =>
    {
        this.props.history.push( this.props.goto );
    }

    render()
    {
        let { goto, match, location, history, staticContext, onClick, ...rest } = this.props;

        return (
            <Button
                {...rest}
                onClick={this.clickHandler}
            />
        );
    }
}

export const ButtonGoToHistory = withRouter( ButtonGoTo );