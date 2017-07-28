import React, { Component } from 'react';
import { FormGroup, InputGroup, Button, FormControl } from "react-bootstrap";

export default class TextInput extends Component
{
    constructor( props )
    {
        super( props );
        this.state = {
            value: ""
        };
    }

    saveValue = ( { target } ) =>
    {
        if ( !this.input ) this.input = target;

        this.setState( {
            value: target.value
        }); 
    }

    sendText = ( e ) =>
    {
        this.props.onSubmit( e, this.state.value );

        if ( this.input )
            this.input.value = '';
    }

    onTextKeyPress = ( e ) =>
    {
        if ( e.key === 'Enter' )
            this.sendText( e );
    }

    render()
    {
        return (
            <FormGroup>
                <InputGroup>
                    <FormControl
                        type="text"
                        onChange={this.saveValue}
                        onKeyPress={this.onTextKeyPress}
                    />
                    <InputGroup.Button>
                        <Button onClick={this.sendText}>Invia</Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        );
    }
}