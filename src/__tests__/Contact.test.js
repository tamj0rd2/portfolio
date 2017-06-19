import _ from 'lodash'
import sinon from 'sinon'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { shallow, mount } from 'enzyme'

import React from 'react'
import Contact from '../components/Contact'

chai.use(chaiAsPromised)

let mergeState = (component, newState) => {
  component.setState(previousState => _.merge({}, previousState, newState))
  return component
}

let expectedFields = ['name', 'email', 'message']

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

      expect(state.btnText).to.equal('Send')
      expect(state.showBtn).to.be.true
      expect(state.alertText).to.equal('')
      expect(state.alertClass).to.be.null
      expect(state.showAlert).to.be.false
      expect(state).to.be.an('object')
    })

    describe('fields', () => {
      it('has an object for name, email and message', () => {
        let state = wrapper.state().fields

        expectedFields.forEach(fieldName =>
          expect(state[fieldName]).to.be.an('object')
        )
      })

      it('has the correct state for name, email and message', () => {
        let state = wrapper.state().fields
        for (let field in state) {
          expect(state[field].value).to.equal('')
          expect(state[field].isValid).to.be.null
          expect(state[field].showFeedback).to.be.false
          expect(state[field].showHelpBlock).to.be.false
        }
      })
    })
  })
})

describe('Output', () => {
  let wrapper = shallow(<Contact />)

  beforeEach(() => {
    wrapper = shallow(<Contact />)
  })

  it('contains 3 FormSections', () => {
    expect(wrapper.find('FormSection')).to.have.length(3)
  })

  it('contains a submit button', () => {
    expect(wrapper.find('Button')).to.have.length(1)
  })

  describe('Button', () => {
    describe('when btnText is "Sending..."', () => {
      it('should be disabled', () => {
        mergeState(wrapper, { btnText: 'Sending...' })
        expect(wrapper.find('Button').prop('disabled')).to.be.true
      })
    })

    describe('when btnText is not "Sending..."', () => {
      it('should be enabled', () => {
        mergeState(wrapper, { btnText: 'Hello, world!' })
        expect(wrapper.find('Button').prop('disabled')).to.be.false
      })
    })

    describe('when showBtn is true', () => {
      it('should be shown', () => {
        mergeState(wrapper, { showBtn: true })
        let expected = 'btn-primary'
        expect(wrapper.find('Button').prop('className')).to.equal(expected)
      })
    })

    describe('when showBtn is false', () => {
      it('should be hidden', () => {
        mergeState(wrapper, { showBtn: false })
        let expected = 'btn-primary hidden'
        expect(wrapper.find('Button').prop('className')).to.equal(expected)
      })
    })
  })

  it('contains an alert', () => {
    expect(wrapper.find('Alert')).to.have.length(1)
  })

  describe('Alert', () => {
    describe('when showAlert is true', () => {
      it('is shown', () => {
        mergeState(wrapper, { showAlert: true })
        expect(wrapper.find('Alert').prop('className')).to.equal('')
      })
    })

    describe('when showAlert is false', () => {
      it('is hidden', () => {
        mergeState(wrapper, { showAlert: false })
        expect(wrapper.find('Alert').prop('className')).to.equal('hidden')
      })
    })

    describe('when alertClass is "success"', () => {
      it('should have the text "Success!"', () => {
        mergeState(wrapper, { alertClass: 'success' })
        let alertHeaderText = wrapper.find('Alert').find('strong').text()
        expect(alertHeaderText).to.equal('Success!')
      })
    })

    describe('when alertClass is not "success"', () => {
      it('should have the text "Oops!"', () => {
        let failureClasses = ['danger', null, undefined]
        failureClasses.forEach(alertClass => {
          mergeState(wrapper, { alertClass })
          let alertHeaderText = wrapper.find('Alert').find('strong').text()
          expect(alertHeaderText).to.equal('Oops!')
        })
      })
    })
  })
})

describe('Events', () => {
  let wrapper, handleSubmit

  beforeEach(() => {
    handleSubmit = sinon.stub(Contact.prototype, 'handleSubmit')
    wrapper = mount(<Contact />)
  })

  afterEach(() => {
    handleSubmit.restore()
  })

  describe('when the form is submitted', () => {
    it('calls handleOnSubmit with an event', () => {
      wrapper.find('form').simulate('submit')
      expect(handleSubmit.calledOnce).to.be.true
      expect(handleSubmit.firstCall.args).to.have.length(1)
      expect(handleSubmit.firstCall.args[0]).to.be.an('object')
    })
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
      wrapper.instance().handleOnChange(event, 'name')
      expect(wrapper.state().fields.name.value).to.equal('A new value')
    })

    it('Marks whether or not the new input value is valid', () => {
      wrapper.instance().handleOnChange(event, 'name')
      expect(wrapper.state().fields.name.isValid).to.be.a('boolean')
    })

    it('Hides any feedback that was on the FormGroup', () => {
      mergeState(wrapper, { fields: { name: { showFeedback: true } } })

      wrapper.instance().handleOnChange(event, 'name')
      expect(wrapper.state().fields.name.showFeedback).to.be.false
    })
  })

  describe('isValid', () => {
    let expectIsValid = (validatorName, newValue) => {
      let msg = `Validator: "${validatorName}". Value: "${newValue}"`
      return expect(wrapper.instance().isValid(validatorName, newValue), msg)
    }

    it('returns true or false', () => {
      expectIsValid().to.be.a('boolean')
    })

    it('returns false for unknown validators', () => {
      let unknownValidators = ['hello', 'world', '!']
      unknownValidators.forEach(val => expectIsValid(val, 'abc').to.be.false)
    })

    describe('validator: name', () => {
      let nameIsValid = nameToTest => {
        return expectIsValid('name', nameToTest)
      }

      it('returns false if a name is not given', () => {
        let blankNames = ['', null, undefined]
        blankNames.forEach(name => nameIsValid(name).to.be.false)
      })

      it('returns false if the name is less than 3 characters long', () => {
        let shortNames = ['ab', '']
        shortNames.forEach(name => nameIsValid(name).to.be.false)
      })

      it('returns false if the name is more than 50 characters long', () => {
        let longName = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        nameIsValid(longName).to.be.false
      })

      it('returns false if symbols other than spaces and ._- are found', () => {
        let badNames = [
          'Hello!',
          'Hello &$%',
          'Hello world!',
          'Hello, world',
          'yo whatup =)'
        ]
        badNames.forEach(name => nameIsValid(name).to.be.false)
      })

      it('returns true if none of the above conditions are met', () => {
        let longName = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        let goodNames = [
          longName,
          'tamj0rd2',
          'jim.bob',
          '-_-',
          'yo whatup',
          'John_Doe',
          'Sue'
        ]
        goodNames.forEach(name => nameIsValid(name).to.be.true)
      })
    })

    describe('validator: email', () => {
      let emailIsValid = emailToTest => {
        return expectIsValid('email', emailToTest)
      }

      it('returns false if no email is given', () => {
        let blankEmails = ['', null, undefined]
        blankEmails.forEach(email => emailIsValid(email).to.be.false)
      })

      it('returns false if the email address is not valid', () => {
        let badEmails = [
          'hello, world',
          'hello@world',
          'hello@world.z',
          'hello@world!.com'
        ]
        badEmails.forEach(email => emailIsValid(email).to.be.false)
      })

      it('returns true if the email address is valid', () => {
        let validEmails = [
          'a@b.com',
          'hello@world.xyz',
          'hello-world!@something.com',
          'whatup+dog@gov.org.uk'
        ]
        validEmails.forEach(email => emailIsValid(email).to.be.true)
      })
    })

    describe('validator: message', () => {
      let msgIsValid = messageToTest => {
        return expectIsValid('message', messageToTest)
      }

      it('returns false if no message was given', () => {
        let blankMsgs = ['', null, undefined]
        blankMsgs.forEach(msg => msgIsValid(msg).to.be.false)
      })

      it('returns false if the message is less than 5 chars long', () => {
        let shortMsgs = ['Welp', ':-(', ':<']
        shortMsgs.forEach(msg => msgIsValid(msg).to.be.false)
      })

      it('returns true if the message is at least 5 chars long', () => {
        let goodMsgs = ['hello', 'Testing is fun! :D']
        goodMsgs.forEach(msg => msgIsValid(msg).to.be.true)
      })
    })
  })

  describe('showHelp', () => {
    let fields = {
      validFields: ['message'],
      invalidFields: ['name', 'email']
    }

    mergeState(wrapper, {
      fields: { message: { showHelpBlock: true } }
    })
    wrapper.instance().showHelp(fields)
    let fieldsState = wrapper.state('fields')

    it('shows helpblocks for invalid fields', () => {
      fields.invalidFields.forEach(field => {
        expect(fieldsState[field].showHelpBlock).to.be.true
      })
    })

    it('hides the helpblocks for valid fields', () => {
      fields.validFields.forEach(field => {
        expect(fieldsState[field].showHelpBlock).to.be.false
      })
    })
  })

  describe('showAllFeedback', () => {
    it('shows feedback for all fields', () => {
      wrapper.instance().showAllFeedback()
      let fieldsState = wrapper.state('fields')

      for (let field in fieldsState) {
        expect(fieldsState[field].showFeedback).to.be.true
      }
    })
  })

  describe('getFieldsValidity', () => {
    mergeState(wrapper, {
      fields: {
        name: { isValid: false },
        email: { isValid: false },
        message: { isValid: true }
      }
    })

    let result = wrapper.instance().getFieldsValidity()

    it('returns an object', () => {
      expect(result).to.be.an('object')
    })

    describe('validFields', () => {
      it('is an array', () => {
        expect(result.validFields).to.be.an('array')
      })

      it('is an array of the names of invalid fields', () => {
        expect(result.validFields).to.contain('message')
        expect(result.validFields).to.not.contain('name')
        expect(result.validFields).to.not.contain('email')
      })
    })

    describe('invalidFields', () => {
      it('is an array', () => {
        expect(result.invalidFields).to.be.an('array')
      })

      it('is an array of the names of invalid fields', () => {
        expect(result.invalidFields).to.contain('name')
        expect(result.invalidFields).to.contain('email')
        expect(result.invalidFields).to.not.contain('message')
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
            showFeedback: true
          }
        }
      })
      wrapper.instance().resetFormValidation()
    })

    let expectFieldState = (field, propToTest) => {
      return expect(wrapper.state('fields')[field][propToTest])
    }

    it('sets the validity of all fields to null', () => {
      for (let field in wrapper.state('fields')) {
        expectFieldState(field, 'isValid').to.be.null
      }
    })

    it('hides the helpblocks for all fields', () => {
      for (let field in wrapper.state('fields')) {
        expectFieldState(field, 'showHelpBlock').to.be.false
      }
    })

    it('hides the validation for all fields', () => {
      for (let field in wrapper.state('fields')) {
        expectFieldState(field, 'showFeedback').to.be.false
      }
    })
  })

  describe('showAlert', () => {
    it('sets the button text to "Send"', () => {
      mergeState(wrapper, { btnText: 'Hello, world' })
      wrapper.instance().showAlert('success')
      expect(wrapper.state('btnText')).to.equal('Send')
    })

    it('shows the alert', () => {
      wrapper.instance().showAlert('success')
      expect(wrapper.state('showAlert')).to.be.true
    })

    it('sets the alert class to the given status', () => {
      wrapper.instance().showAlert('success')
      expect(wrapper.state('alertClass')).to.equal('success')
    })

    describe('when the given status is "success"', () => {
      it('sets the alert text to "Your email has been sent :)"', () => {
        let expectedText = 'Your email has been sent :)'
        wrapper.instance().showAlert('success')
        expect(wrapper.state('alertText')).to.equal(expectedText)
      })

      it('hides the button', () => {
        wrapper.instance().showAlert('success')
        expect(wrapper.state('showBtn')).to.be.false
      })
    })

    describe('when the given status is "danger"', () => {
      it('sets the alert text to "Something went wrong. Please try again."', () => {
        let expectedText = 'Something went wrong. Please try again.'
        wrapper.instance().showAlert('danger')
        expect(wrapper.state('alertText')).to.equal(expectedText)
      })

      it('shows the button', () => {
        mergeState(wrapper, { showBtn: true })
        wrapper.instance().showAlert('danger')
        expect(wrapper.state('showBtn')).to.be.true
      })
    })

    describe('when status is neither "danger" nor "success"', () => {
      it('throws an error', () => {
        expect(wrapper.instance().showAlert).to.throw(TypeError, 'status')
        let testWithArg = () => {
          wrapper.instance().showAlert('hello')
        }
        expect(testWithArg).to.throw(TypeError, 'status')
      })
    })
  })

  describe('handleSubmit', () => {
    let wrapper, promise
    let getFieldsValidity, sendEmail, resetFormV, showAlert, showAllFB, showHelp
    let event = { preventDefault() {} }

    beforeEach(() => {
      getFieldsValidity = sinon.stub(Contact.prototype, 'getFieldsValidity')
      sendEmail = sinon.stub(Contact.prototype, 'sendEmail')
      resetFormV = sinon.stub(Contact.prototype, 'resetFormValidation')
      showAlert = sinon.stub(Contact.prototype, 'showAlert')
      showAllFB = sinon.stub(Contact.prototype, 'showAllFeedback')
      showHelp = sinon.stub(Contact.prototype, 'showHelp')
      wrapper = shallow(<Contact />)
    })

    afterEach(() => {
      getFieldsValidity.restore()
      sendEmail.restore()
      resetFormV.restore()
      showAlert.restore()
      showAllFB.restore()
      showHelp.restore()
      promise = null
    })

    it('prevents the page from reloading on submit', () => {
      let preventDefault = sinon.stub(event, 'preventDefault')
      getFieldsValidity.returns({ validFields: [], invalidFields: ['abc'] })
      wrapper.instance().handleSubmit(event)
      expect(preventDefault.calledOnce).to.be.true
    })

    it('calls getFieldsValidity once', () => {
      getFieldsValidity.returns({ validFields: [], invalidFields: ['abc'] })
      wrapper.instance().handleSubmit(event)
      expect(getFieldsValidity.calledOnce).to.be.true
    })

    it('calls showAllFeedback once', () => {
      getFieldsValidity.returns({ validFields: [], invalidFields: ['abc'] })
      wrapper.instance().handleSubmit(event)
      expect(showAllFB.calledOnce).to.be.true
    })

    describe('if there are no invalid fields', () => {
      let validFields = ['name', 'email', 'message']

      beforeEach(() => {
        getFieldsValidity.returns({ validFields, invalidFields: [] })
      })

      describe('if the email was sent successfully', () => {
        beforeEach(() => {
          sendEmail.resolves(true)
          promise = wrapper.instance().handleSubmit(event)
        })

        it('resolves to true', () => {
          return expect(promise).to.eventually.be.true
        })

        it('calls resetFormValidation', () => {
          return expect(promise).to.be.fulfilled.then(() => {
            expect(resetFormV.calledOnce).to.be.true
          })
        })

        it('calls showAlert with the arg "success', () => {
          return expect(promise).to.be.fulfilled.then(() => {
            expect(showAlert.calledOnce).to.be.true
            expect(showAlert.calledWith('success')).to.be.true
          })
        })
      })

      describe('if the email was not sent successfully', () => {
        beforeEach(() => {
          sendEmail.resolves(false)
          promise = wrapper.instance().handleSubmit(event)
        })

        it('resolves to false', () => {
          expect(promise).to.eventually.equal(false)
        })

        it('calls showAlert with the arg "danger"', () => {
          sendEmail.resolves(false)
          return expect(promise).to.be.fulfilled.then(() => {
            expect(showAlert.calledOnce).to.be.true
          })
        })
      })
    })

    describe('if there are one or more invalid fields', () => {
      let fields = {
        invalidFields: ['name', 'message'],
        validFields: ['email']
      }

      beforeEach(() => {
        getFieldsValidity.returns(fields)
      })

      it('resolves to false', () => {
        promise = wrapper.instance().handleSubmit(event)
        return expect(promise).to.eventually.be.false
      })

      it('calls showHelp once with the array of invalid fields', () => {
        wrapper.instance().handleSubmit(event)
        expect(showHelp.calledOnce).to.be.true
        expect(showHelp.calledWith(fields)).to.be.true
      })
    })
  })
})
