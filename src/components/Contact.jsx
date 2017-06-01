import React, { Component } from 'react'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

class Contact extends Component {
  state = {
    name: '',
    email: '',
    message: ''
  };

  handleNameChange = e => {
    this.setState({ name: e.target.value })
  };
  handleEmailChange = e => {
    this.setState({ email: e.target.value })
  };

  handleMessageChange = e => {
    this.setState({ message: e.target.value })
  };

  render() {
    return (
      <div>
        <footer className="container">
          <h1>Get in touch</h1>

          <form>
            <FormGroup>
              <ControlLabel>Name *</ControlLabel>
              <FormControl
                componentClass="input"
                type="text"
                value={this.state.name}
                onChange={this.handleNameChange}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>E-mail address *</ControlLabel>
              <FormControl
                componentClass="input"
                type="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Your message *</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={this.state.message}
                onChange={this.handleMessageChange}
              />
            </FormGroup>

            <Button type="submit" className="btn-primary">
              Send
            </Button>
          </form>
        </footer>
      </div>
    )
  }
}

export default Contact
