import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap'

// When creating a form item, we pass it the parent's state so that we can
// programatically set the state for the correct item during the onchange

export default class FormSection extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.props.onChange(e, this.props.identifier)
  }

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
          onChange={this.onChange}
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
