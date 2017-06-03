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
        <HelpBlock className={state.showHelpBlock ? '' : 'hidden'}>
          {this.props.helpText}
        </HelpBlock>
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
  constructor(props) {
    super(props)
    let state = {
      btnText: 'Send',
      fields: {}
    };

    ['name', 'email', 'message'].forEach(identifier => {
      state.fields[identifier] = {
        value: '',
        isValid: null,
        showValidation: false,
        showHelpBlock: false
      }
    })

    this.state = state
  }

  handleOnChange = (e, identifier) => {
    // updates the value and validation for whichever input field got changed
    let newState = R.clone(this.state.fields)
    newState[identifier].value = e.target.value
    newState[identifier].isValid = this.isValid(identifier, e.target.value)

    // the value changed so hide validation until the next form submission
    newState[identifier].showValidation = false
    this.setState({ fields: newState })
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

  formIsValid = () => {
    let noErrorsFound = true

    // show validation for each FormSection, since we've submitted the form now
    let newState = R.clone(this.state.fields)

    for (let identifier in newState) {
      newState[identifier].showValidation = true
      // only show help block for invalid FormSections
      let isValid = newState[identifier].isValid
      if (!isValid) noErrorsFound = false
      newState[identifier].showHelpBlock = !isValid
    }
    this.setState({ fields: newState })
    return noErrorsFound
  };

  sendEmail = () => {
    // using anything other than FormData causes a CORS problem
    let formData = new FormData()
    for (let identifier in this.state.fields) {
      formData.append(identifier, this.state.fields[identifier].value)
    }

    // TODO: Add some error checking here at some point
    fetch('https://enformed.io/rxgn3qgf', {
      method: 'post',
      body: formData
    }).then(response => {
      if (response.status === 200) {
        this.setState({ btnText: 'Email sent!' })
      }
    })
  };

  resetFormValidation = () => {
    // resets validation settings for all fields
    let newState = R.clone(this.state.fields)

    for (let identifier in newState) {
      newState[identifier].isValid = null
      newState[identifier].showHelpBlock = false
      newState[identifier].showValidation = false
    }

    this.setState({ fields: newState })
  };

  handleSubmit = e => {
    // stop the page from reloading on submit
    e.preventDefault()
    if (this.formIsValid()) {
      this.setState({ btnText: 'Sending...' })
      this.sendEmail()
      this.resetFormValidation()
    }
  };

  render() {
    return (
      <div className="contact">
        <footer className="container">
          <h1>Get in touch</h1>

          <form onSubmit={this.handleSubmit}>
            <FormSection
              labelText="Name"
              identifier="name"
              parentState={this.state.fields}
              onChange={this.handleOnChange}
              inputType="text"
              helpText={`Must be 3-50 characters long. Don't use special
              characters other than spaces, underscores, hyphens and periods.`}
            />
            <FormSection
              labelText="E-mail address"
              identifier="email"
              parentState={this.state.fields}
              onChange={this.handleOnChange}
              inputType="email"
              helpText="Please enter a valid email address."
            />
            <FormSection
              labelText="Your message"
              identifier="message"
              parentState={this.state.fields}
              onChange={this.handleOnChange}
              componentClass="textarea"
              helpText="Please enter a message more than 5 characters long."
            />

            <Button
              type="submit"
              className="btn-primary"
              bsStyle={this.state.btnText === 'Email sent!' ? 'success' : null}
              disabled={R.contains(this.state.btnText, [
                'Sending...',
                'Email sent!'
              ])}
            >
              {this.state.btnText}
            </Button>
          </form>
        </footer>
      </div>
    )
  }
}

export default Contact
