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

  describe('isValid', () => {
    let validate = (identifier, newValue) => {
      return expect(wrapper.instance().isValid(identifier, newValue))
    }

    it('returns true or false', () => {
      validate().to.be.a('boolean')
    })

    describe('case: name', () => {
      it('returns false if a name is not given', () => {
        validate('name', undefined).to.be.false
        validate('name', null).to.be.false
      })

      it('returns false if the name is less than 3 characters long', () => {
        validate('name', 'ab').to.be.false
        validate('name', '').to.be.false
      })

      it('returns false if the name is more than 50 characters long', () => {
        let longName = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        validate('name', longName).to.be.false
      })

      it('returns false if symbols other than spaces and ._- are found', () => {
        validate('name', 'Hello!').to.be.false
        validate('name', 'Hello &$%').to.be.false
        validate('name', 'Hello world!').to.be.false
        validate('name', 'Hello, world').to.be.false
        validate('name', 'yo whatup =)').to.be.false
      })

      it('returns true if none of the above conditions are met', () => {
        let longName = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        validate('name', longName).to.be.true
        validate('name', 'tamj0rd2').to.be.true
        validate('name', 'jim.bob').to.be.true
        validate('name', '-_-').to.be.true
        validate('name', 'yo whatup').to.be.true
        validate('name', 'John_Doe').to.be.true
        validate('name', 'Sue').to.be.true
      })
    })
  })
})
