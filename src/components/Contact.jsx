import React, { Component } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import validator from 'validator'
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
    let state = this.props.parentState[this.props.identifier]
    let validationState = null

    if (state.showValidation) {
      if (state.isValid) validationState = 'success'
      else validationState = 'error'
    }

    return (
      <FormGroup validationState={validationState}>
        <ControlLabel>{`${this.props.labelText} *`}</ControlLabel>
        <FormControl
          componentClass={this.props.componentClass}
          type={this.props.inputType}
          value={state.value}
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
    name: {
      value: '',
      isValid: null,
      showValidation: false
    },
    email: {
      value: '',
      isValid: null,
      showValidation: false
    },
    message: {
      value: '',
      isValid: null,
      showValidation: false
    }
  };

  handleOnChange = (e, identifier) => {
    // updates the value and validation for whichever input field got changed
    let newState = R.clone(this.state[identifier])
    newState.value = e.target.value
    newState.isValid = this.isValid(identifier, newState.value)

    // the value changed so hide validation until the next form submission
    newState.showValidation = false
    this.setState({ [`${identifier}`]: newState })
  };

  isValid = (identifier, newValue) => {
    switch (identifier) {
      case 'name':
        return /^[A-z0-9\s._-]{3,50}$/.test(newValue)
      case 'email':
        return validator.isEmail(newValue)
      case 'message':
        return /^.{5,}/.test(newValue)
      default:
        return false
    }
  };

  showValidation = () => {
    // show validation for each FormSection, since we've submitted the form now
    let newState = R.clone(this.state)

    for (let identifier in this.state) {
      newState[identifier].showValidation = true
      this.setState({ [`${identifier}`]: newState[identifier] })
    }
  };

  handleSubmit = e => {
    this.showValidation()
    e.preventDefault()
  };

  render() {
    return (
      <div>
        <footer className="container">
          <h1>Get in touch</h1>

          <form onSubmit={this.handleSubmit}>
            <FormSection
              labelText="Name"
              identifier="name"
              parentState={this.state}
              onChange={this.handleOnChange}
              inputType="text"
              helpText="Don't use special characters other than spaces, underscores, hyphens and periods."
            />
            <FormSection
              labelText="E-mail address"
              identifier="email"
              parentState={this.state}
              onChange={this.handleOnChange}
              inputType="email"
              helpText="Please enter a valid email address."
            />
            <FormSection
              labelText="Your message"
              identifier="message"
              parentState={this.state}
              onChange={this.handleOnChange}
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
