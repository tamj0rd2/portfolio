import React, { Component } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import validator from 'validator'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Button,
  Alert
} from 'react-bootstrap'

export class FormSection extends Component {
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

export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.isValid = this.isValid.bind(this)
    this.formIsValid = this.formIsValid.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.resetFormValidation = this.resetFormValidation.bind(this)
    this.showAlert = this.showAlert.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    let state = {
      btnText: 'Send',
      btnClass: true,
      alertText: '',
      alertClass: null,
      showAlert: false,
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

  handleOnChange(e, identifier) {
    // updates the value and validation for whichever input field got changed
    let newState = R.clone(this.state.fields)
    newState[identifier].value = e.target.value
    newState[identifier].isValid = this.isValid(identifier, e.target.value)

    // the value changed so hide validation until the next form submission
    newState[identifier].showValidation = false
    this.setState({ fields: newState })
  }

  isValid(identifier, newValue) {
    if (!newValue) {
      return false
    }
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
  }

  formIsValid() {
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
  }

  sendEmail() {
    // using JSON.stringify doesn't send any data in the request
    let formData = new FormData()
    formData.append('Name', this.state.fields.name.value)
    formData.append('Email', this.state.fields.email.value)
    formData.append('Message', this.state.fields.message.value)
    formData.append('_subject', 'Portfolio response received')
    formData.append('_gotcha', '')

    return fetch('https://formspree.io/tamj0rd2@outlook.com', {
      headers: {
        Accept: 'application/json'
      },
      method: 'POST',
      body: formData
    })
  }

  resetFormValidation() {
    // resets validation settings for all fields
    let newState = R.clone(this.state.fields)

    for (let identifier in newState) {
      newState[identifier].isValid = null
      newState[identifier].showHelpBlock = false
      newState[identifier].showValidation = false
    }

    this.setState({ fields: newState })
  }

  showAlert(status) {
    let alertText = ''
    let btnClass = ''

    if (status === 'success') {
      alertText = 'Your email has been sent :)'
      btnClass = 'hidden'
    } else if (status === 'danger') {
      alertText = 'Something went wrong. Please try again.'
    }
    this.setState({
      btnText: 'Send',
      btnClass: btnClass,
      showAlert: true,
      alertClass: status,
      alertText: alertText
    })
  }

  handleSubmit(e) {
    // stop the page from reloading on submit
    e.preventDefault()

    // this isn't in the if statement because I want the alert to be hidden
    // every time the form gets submitted, even if the form is invalid.
    this.setState({ showAlert: false, alertClass: null })

    if (this.formIsValid()) {
      this.setState({ btnText: 'Sending...' })
      this.sendEmail()
        .then(response => {
          if (response.status === 200) {
            this.resetFormValidation()
            this.showAlert('success')
          } else {
            this.showAlert('danger')
          }
        })
        .catch(err => this.showAlert('danger'))
    }
  }

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

            <Alert
              bsStyle={this.state.alertClass}
              className={this.state.showAlert ? '' : 'hidden'}
            >
              <strong>
                {this.state.alertClass === 'success' ? 'Success' : 'Oops'}!
              </strong>
              &nbsp;{this.state.alertText}
            </Alert>

            <Button
              type="submit"
              className={`btn-primary ${this.state.btnClass}`}
              disabled={this.state.btnText === 'Sending...'}
            >
              {this.state.btnText}
            </Button>

          </form>
        </footer>
      </div>
    )
  }
}
