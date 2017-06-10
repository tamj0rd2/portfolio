import _ from 'lodash'
import sinon from 'sinon'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { shallow } from 'enzyme'

import React from 'react'
import Contact, { FormSection } from '../components/Contact'
import { Button, Alert } from 'react-bootstrap'

chai.use(chaiAsPromised)

let mergeState = (component, newState) => {
  component.setState(previousState => _.merge({}, previousState, newState))
}

describe('Initial values', () => {
  let wrapper = shallow(<Contact />)

  beforeEach(() => {
    wrapper = shallow(<Contact />)
  })

  describe('Props', () => {
    it('has the classname "contact"', () => {
      expect(wrapper.prop('className')).to.equal('contact')
    })
  })

  describe('State', () => {
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

  beforeEach(() => {
    wrapper = shallow(<Contact />)
  })

  afterEach(() => {
    wrapper = null
  })

  describe('handleOnChange', () => {
    let event = { target: { value: 'A new value' } }

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
    let validate = (validatorName, newValue) => {
      return expect(wrapper.instance().isValid(validatorName, newValue))
    }

    it('returns true or false', () => {
      validate().to.be.a('boolean')
    })

    it('returns false for unknown validators', () => {
      validate('hello', 'Some Value').to.be.false
      validate('world', 'another@value.net').to.be.false
      validate('!', 'Yet another value!').to.be.false
    })

    describe('validator: name', () => {
      it('returns false if a name is not given', () => {
        validate('name', '').to.be.false
        validate('name', null).to.be.false
        validate('name', undefined).to.be.false
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

    describe('validator: email', () => {
      it('returns false if no email is given', () => {
        validate('email', '').to.be.false
        validate('email', null).to.be.false
        validate('email', undefined).to.be.false
      })

      it('returns false if the email address is not valid', () => {
        validate('email', 'hello, world').to.be.false
        validate('email', 'hello@world').to.be.false
        validate('email', 'hello@world.z').to.be.false
        validate('email', 'hello@world!.com').to.be.false
      })

      it('returns true if the email address is valid', () => {
        validate('email', 'a@b.com').to.be.true
        validate('email', 'hello@world.xyz').to.be.true
        validate('email', 'hello-world!@something.com').to.be.true
        validate('email', 'whatup+dog@gov.org.uk').to.be.true
      })
    })

    describe('validator: message', () => {
      it('returns false if no message was given', () => {
        validate('message', '').to.be.false
        validate('message', null).to.be.false
        validate('message', undefined).to.be.false
      })

      it('returns false if the message is less than 5 chars long', () => {
        validate('message', 'welp').to.be.false
        validate('message', ':-(').to.be.false
      })

      it('returns true if the message is at least 5 chars long', () => {
        validate('message', 'hello').to.be.true
        validate('message', 'Testing is fun! :D').to.be.true
      })
    })
  })

  describe('formIsValid', () => {
    // TODO: this shouldn't really be modifying the state. perhaps there should
    // be a setFieldValidity function to handle that?
    it('returns true or false', () => {
      expect(wrapper.instance().formIsValid()).to.be.a('boolean')
    })

    it('it shows validation feedback for all fields', () => {
      wrapper.instance().formIsValid()
      expect(wrapper.instance().state.fields.name.showValidation).to.be.true
      expect(wrapper.instance().state.fields.email.showValidation).to.be.true
      expect(wrapper.instance().state.fields.message.showValidation).to.be.true
    })

    describe('when any fields are invalid', () => {
      let instance = shallow(<Contact />).instance()
      mergeState(instance, {
        fields: {
          name: { isValid: false },
          email: { isValid: true },
          message: { isValid: false }
        }
      })
      let returnValue = instance.formIsValid()

      it('returns false', () => {
        expect(returnValue).to.be.false
      })

      it('shows the helpblock for the offending fields', () => {
        // instance.formIsValid()
        expect(instance.state.fields.name.showHelpBlock).to.be.true
        expect(instance.state.fields.email.showHelpBlock).to.be.false
        expect(instance.state.fields.message.showHelpBlock).to.be.true
      })
    })

    describe('when all fields are valid', () => {
      let instance = shallow(<Contact />).instance()
      mergeState(instance, {
        fields: {
          name: { isValid: true },
          email: { isValid: true },
          message: { isValid: true }
        }
      })
      let returnValue = instance.formIsValid()

      it('returns true', () => {
        expect(returnValue).to.be.true
      })

      it('does not show any helpblocks', () => {
        expect(instance.state.fields.name.showHelpBlock).to.be.false
        expect(instance.state.fields.email.showHelpBlock).to.be.false
        expect(instance.state.fields.message.showHelpBlock).to.be.false
      })
    })
  })

  describe('sendEmail', () => {
    let fetchStub

    beforeEach(() => {
      fetchStub = sinon.stub(window, 'fetch')
    })

    afterEach(() => {
      fetchStub.restore()
    })

    it('returns a promise', () => {
      fetchStub.resolves()
      expect(wrapper.instance().sendEmail()).to.be.a('promise')
    })

    it('resolves to true if the email sends successfully', () => {
      fetchStub.resolves({ status: 200 })
      let promise = wrapper.instance().sendEmail()
      return expect(promise).to.eventually.be.true
    })

    it('resolves to false if the status was not 200', () => {
      fetchStub.resolves({ status: 404 })
      let promise = wrapper.instance().sendEmail()
      return expect(promise).to.eventually.be.false
    })

    it('resolves to false if there was an error', () => {
      fetchStub.rejects('An error ocurred')
      let promise = wrapper.instance().sendEmail()
      return expect(promise).to.eventually.be.false
    })
  })

  describe('resetFormValidation', () => {
    beforeEach(() => {
      mergeState(wrapper, {
        fields: {
          email: {
            isValid: false,
            showHelpBlock: true,
            showValidation: true
          }
        }
      })
    })

    it('sets the validity of all fields to null', () => {
      expect(wrapper.state('fields').email.isValid).to.be.false
      wrapper.instance().resetFormValidation()
      for (let field in wrapper.state('fields')) {
        expect(wrapper.state('fields')[field].isValid).to.be.null
      }
    })

    it('hides the helpblocks for all fields', () => {
      expect(wrapper.state('fields').email.showHelpBlock).to.be.true
      wrapper.instance().resetFormValidation()
      for (let field in wrapper.state('fields')) {
        expect(wrapper.state('fields')[field].showHelpBlock).to.be.false
      }
    })

    it('hides the validation for all fields', () => {
      expect(wrapper.state('fields').email.showValidation).to.be.true
      wrapper.instance().resetFormValidation()
      for (let field in wrapper.state('fields')) {
        expect(wrapper.state('fields')[field].showValidation).to.be.false
      }
    })
  })
})
