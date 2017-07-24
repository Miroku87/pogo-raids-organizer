import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";

import "./PopUp.css";

export default class PopUp extends Component
{
    render()
    {
        let { title, message, htmlMessage, ...useful_props } = this.props;

        return (
            <Modal {...useful_props} bsSize="small" aria-labelledby="contained-modal-title-sm">
                <Modal.Header closeButton className={this.props.bsStyle}>
                    <Modal.Title id="contained-modal-title-sm">{title.toUpperCase()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{title}</h4>
                    {htmlMessage && !message && ( <p dangerouslySetInnerHTML={{ __html: htmlMessage }} /> )}
                    {!htmlMessage && message && ( <p> {message} </p> )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Chiudi</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}