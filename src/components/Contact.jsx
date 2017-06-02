import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Button
} from 'react-bootstrap'

class FormSection extends Component {
  // When creating a form item, we pass it the parent's state so that we can
  // programatically set the state for the correct item during the onchange
  render() {
    return (
      <FormGroup>
        <ControlLabel>{`${this.props.labelText} *`}</ControlLabel>
        <FormControl
          componentClass={this.props.componentClass}
          type={this.props.inputType}
          value={this.props.parentState[this.props.identifier]}
          onChange={e => this.props.onChange(e, this.props.identifier)}
        />
        <FormControl.Feedback />
        <HelpBlock>{this.props.helpText}</HelpBlock>
      </FormGroup>
    )
  }
}
FormSection.defaultProps = {
  componentClass: 'input',
  inputType: null
}
FormSection.propTypes = {
  labelText: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  helpText: PropTypes.string.isRequired,
  componentClass: PropTypes.string,
  inputType: PropTypes.string,
  parentState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

class Contact extends Component {
  state = {
    name: '',
    email: '',
    message: ''
  };

  updateFieldValue = (e, identifier) => {
    // updates the state for whichever input field got changed
    this.setState({ [`${identifier}`]: e.target.value })
  };

  render() {
    return (
      <div>
        <footer className="container">
          <h1>Get in touch</h1>

          <form>
            <FormSection
              labelText="Name"
              identifier="name"
              parentState={this.state}
              onChange={this.updateFieldValue}
              inputType="text"
              helpText="Don't use special characters other than spaces, underscores, hyphens and periods."
            />
            <FormSection
              labelText="E-mail address"
              identifier="email"
              parentState={this.state}
              onChange={this.updateFieldValue}
              inputType="email"
              helpText="Please enter a valid email address."
            />
            <FormSection
              labelText="Your message"
              identifier="message"
              parentState={this.state}
              onChange={this.updateFieldValue}
              componentClass="textarea"
              helpText="Please enter a message more than 5 characters long"
            />

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
