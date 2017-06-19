import React, { Component } from 'react'
import { Button, Alert } from 'react-bootstrap'
import FormSection from './FormSection'
import _ from 'lodash'
import validator from 'validator'

export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.isValid = this.isValid.bind(this)
    this.getInvalidFields = this.getInvalidFields.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.resetFormValidation = this.resetFormValidation.bind(this)
    this.showAlert = this.showAlert.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showHelp = this.showHelp.bind(this)
    this.showAllFeedback = this.showAllFeedback.bind(this)

    let state = {
      btnText: 'Send',
      showBtn: true,
      alertText: '',
      alertClass: null,
      showAlert: false,
      fields: {}
    }

    let fieldNames = ['name', 'email', 'message']

    fieldNames.forEach(identifier => {
      state.fields[identifier] = {
        value: '',
        isValid: null,
        showFeedback: false,
        showHelpBlock: false
      }
    })

    this.state = state
  }

  handleOnChange(e, identifier) {
    // updates the value and hides validation for whichever input field changed
    this.setState(prevState => {
      let newState = _.cloneDeep(prevState.fields)
      newState[identifier].value = e.target.value
      newState[identifier].isValid = this.isValid(identifier, e.target.value)
      newState[identifier].showFeedback = false
      return { fields: newState }
    })
  }

  isValid(validatorName, newValue) {
    if (!newValue) {
      return false
    }
    switch (validatorName) {
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

  // TODO: rename this func to getFieldsValidity
  getInvalidFields() {
    // returns a list of invalid fields
    let result = {
      validFields: [],
      invalidFields: []
    }

    _.keys(this.state.fields).forEach(field => {
      if (this.state.fields[field].isValid) {
        result.validFields.push(field)
      } else {
        result.invalidFields.push(field)
      }
    })

    return result
  }

  sendEmail() {
    let formData = new FormData()
    formData.append('Name', this.state.fields.name.value)
    formData.append('Email', this.state.fields.email.value)
    formData.append('Message', this.state.fields.message.value)
    formData.append('_subject', 'Portfolio response received')
    formData.append('_gotcha', '')

    // resolves true if the email got sent, otherwise false
    return fetch('https://formspree.io/tamj0rd2@outlook.com', {
      headers: {
        Accept: 'application/json'
      },
      method: 'POST',
      body: formData
    })
      .then(response => response.status === 200)
      .catch(error => false)
  }

  resetFormValidation() {
    // resets validation settings for all fields
    this.setState(prevState => {
      let newState = _.cloneDeep(prevState.fields)

      for (let identifier in newState) {
        newState[identifier].isValid = null
        newState[identifier].showHelpBlock = false
        newState[identifier].showFeedback = false
      }
      return { fields: newState }
    })
  }

  showAlert(status) {
    let alertText, showBtn

    if (status === 'success') {
      alertText = 'Your email has been sent :)'
      showBtn = false
    } else if (status === 'danger') {
      alertText = 'Something went wrong. Please try again.'
      showBtn = true
    } else {
      throw new TypeError('showAlert called with invalid status')
    }

    this.setState({
      btnText: 'Send',
      showBtn: showBtn,
      showAlert: true,
      alertClass: status,
      alertText: alertText
    })
  }

  showAllFeedback() {
    this.setState(prevState => {
      let newFieldsState = _.cloneDeep(prevState.fields)

      _.keys(newFieldsState).forEach(field => {
        newFieldsState[field].showFeedback = true
      })

      return { fields: newFieldsState }
    })
  }

  showHelp(fields) {
    this.setState(prevState => {
      let newFieldsState = _.cloneDeep(prevState.fields)

      fields.validFields.forEach(field => {
        newFieldsState[field].showHelpBlock = false
      })

      fields.invalidFields.forEach(field => {
        newFieldsState[field].showHelpBlock = true
      })
      return { fields: newFieldsState }
    })
  }

  handleSubmit(e) {
    // stop the page from reloading on submit
    e.preventDefault()

    // this isn't in the if statement because I want the alert to be hidden
    // every time the form gets submitted, even if the form is invalid.
    this.setState({ showAlert: false, alertClass: null })
    this.showAllFeedback()

    let fields = this.getInvalidFields()

    if (fields.invalidFields.length === 0) {
      this.setState({ btnText: 'Sending...' })
      return this.sendEmail().then(emailSent => {
        if (emailSent) {
          this.resetFormValidation()
          this.showAlert('success')
        } else {
          this.showAlert('danger')
        }
        return emailSent
      })
    } else {
      this.showHelp(fields)
      return Promise.resolve(false)
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
              className={`btn-primary${this.state.showBtn ? '' : ' hidden'}`}
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
