import { default as React, Component } from "react";
import { Navbar, FormGroup, Button, FormControl } from "react-bootstrap";

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
                        <a href="#" alt="logo"><img src={logo} alt="logo" /></a>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <a href="#">{this.props.title}</a>
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