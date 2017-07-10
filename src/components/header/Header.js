import { default as React, Component } from "react";
import { Navbar } from "react-bootstrap";
import "./Header.css";

export default class Header extends Component
{
    render()
    {
        return (
            <Navbar>
                <a className="navbar-brand" href="#">{this.props.title}</a>
            </Navbar>
            );
    }
}