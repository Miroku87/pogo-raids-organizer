import { default as React, Component } from "react";
import { Navbar, FormGroup, Button, FormControl } from "react-bootstrap";
import { Link } from 'react-router-dom'

import logo from "../../assets/logo.png";
import "./Header.css";

export default class Header extends Component
{
    render()
    {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/"><img src={logo} alt="logo" /></Link>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <Link to="/">{this.props.title}</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Form pullRight>
                    <FormGroup>
                        <FormControl type="text" placeholder={this.props.search_placeholder} />
                    </FormGroup>
                    {' '}
                    <Button type="submit">{this.props.search_action}</Button>
                </Navbar.Form>
            </Navbar>
            );
    }
}