import React, { Component } from 'react'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

class Contact extends Component {
  handleNameChange = () => {};
  handleEmailChange = () => {};
  handleMessageChange = () => {};
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
                value=""
                onChange={this.handleNameChange}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>E-mail address *</ControlLabel>
              <FormControl
                componentClass="input"
                type="email"
                value=""
                onChange={this.handleEmailChange}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Your message *</ControlLabel>
              <FormControl
                componentClass="textarea"
                value=""
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
