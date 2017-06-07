import sinon from 'sinon'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'

import React from 'react'
import ReactDOM from 'react-dom'
import Contact, { FormSection } from '../components/Contact'
import { Button, Alert } from 'react-bootstrap'

describe('Initial values', () => {
  describe('Props', () => {
    it('has the classname "contact"', () => {
      let wrapper = shallow(<Contact />)
      expect(wrapper.prop('className')).to.equal('contact')
    })
  })

  describe('State', () => {
    let wrapper = shallow(<Contact />)

    beforeEach(() => {
      wrapper = shallow(<Contact />)
    })

    it('has the correct base state', () => {
      let state = wrapper.state()
      let expectedFields = ['name', 'email', 'message']

      expect(state.btnText).to.equal('Send')
      // TODO: should probably be changed to showBtn?
      expect(state.btnClass).to.be.true
      expect(state.alertText).to.equal('')
      expect(state.alertClass).to.be.null
      expect(state.showAlert).to.be.false

      expect(state).to.have.property('fields')
      expect(Object.keys(state.fields)).to.have.length(3)
      expect(Object.keys(state.fields)).to.have.same.members(expectedFields)
    })

    it('has the correct state for each field', () => {
      let state = wrapper.state().fields
      for (let field in state) {
        expect(state[field].value).to.equal('')
        expect(state[field].isValid).to.be.null
        // TODO: should probably be changed to showFeedback
        expect(state[field].showValidation).to.be.false
        expect(state[field].showHelpBlock).to.be.false
      }
    })
  })
})

describe('Output', () => {
  let wrapper = shallow(<Contact />)

  beforeEach(() => {
    wrapper = shallow(<Contact />)
  })

  it('contains 3 FormSections', () => {
    expect(wrapper.find(FormSection)).to.have.length(3)
  })

  it('contains a submit button', () => {
    expect(wrapper.find(Button)).to.have.length(1)
  })

  it('contains an alert', () => {
    expect(wrapper.find(Alert)).to.have.length(1)
  })
})

describe('Functions', () => {
  let wrapper = shallow(<Contact />)
  let event = { target: { value: 'A new value' } }

  beforeEach(() => {
    wrapper = shallow(<Contact />)
  })

  describe('handleOnChange', () => {
    it('Updates the value for the input that was changed', () => {
      expect(wrapper.state().fields.name.value).to.equal('')
      wrapper.instance().handleOnChange(event, 'name')
      expect(wrapper.state().fields.name.value).to.equal('A new value')
    })

    it('Marks whether or not the new input value is valid', () => {
      expect(wrapper.state().fields.name.isValid).to.be.null
      wrapper.instance().handleOnChange(event, 'name')
      expect(wrapper.state().fields.name.isValid).to.be.a('boolean')
    })

    it('Hides any validation feedback that was on the FormGroup', () => {
      wrapper.setState({ fields: { name: { showValidation: true } } })
      expect(wrapper.state().fields.name.showValidation).to.be.true
      wrapper.instance().handleOnChange(event, 'name')
      expect(wrapper.state().fields.name.showValidation).to.be.false
    })
  })
})
