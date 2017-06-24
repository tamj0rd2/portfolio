import _ from 'lodash'
import sinon from 'sinon'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'

import React from 'react'
import FormSection from '../components/FormSection'

let props = {
  labelText: 'FieldName',
  identifier: 'fieldname',
  helpText: 'You did something wrong',
  parentState: {
    fieldname: {
      showFeedback: false,
      isValid: false
    }
  },
  onChange: () => {}
}

describe('Initial values', () => {
  describe('props', () => {
    let expectTheeseToDeepEqual = (actualProps, expectedProps) => {
      for (let prop in expectedProps) {
        let msg = `testing prop ${prop}`
        let expectedProp = expectedProps[prop]
        let actualProp = actualProps[prop]
        expect(actualProp, msg).to.deep.equal(expectedProp)
      }
    }

    describe('when all props are given', () => {
      it('has all of the given props', () => {
        let givenProps = _.merge({}, props, {
          componentClass: 'input',
          inputType: null
        })

        let wrapper = mount(<FormSection {...givenProps} />)
        expectTheeseToDeepEqual(wrapper.props(), givenProps)
      })
    })

    describe('when required props are missing', () => {
      it('throws an error', () => {
        let consoleStub = sinon.stub(console, 'error')
        expect(() => mount(<FormSection />)).to.throw(TypeError)
        consoleStub.restore()
      })
    })

    describe('when neither componentClass nor inputType are given', () => {
      it('uses the defaultProps', () => {
        let expectedProps = _.merge({}, props, {
          componentClass: 'input',
          inputType: null
        })

        let wrapper = mount(<FormSection {...props} />)
        expectTheeseToDeepEqual(wrapper.props(), expectedProps)
      })
    })

    describe('when componentClass is the only prop not given', () => {
      let givenProps = _.merge({ inputType: 'something' }, props)
      let wrapper = mount(<FormSection {...givenProps} />)

      it('defaults to "input"', () => {
        expect(wrapper.prop('componentClass')).to.equal('input')
      })

      it('has all other given props', () => {
        expectTheeseToDeepEqual(wrapper.props(), givenProps)
      })
    })

    describe('when inputType is the only prop not given', () => {
      let givenProps = _.merge({ componentClass: 'something' }, props)
      let wrapper = mount(<FormSection {...givenProps} />)

      it('defaults to null', () => {
        expect(wrapper.prop('inputType')).to.equal(null)
      })

      it('has all other given props', () => {
        expectTheeseToDeepEqual(wrapper.props(), givenProps)
      })
    })
  })

  describe('state', () => {
    it('should be null', () => {
      let wrapper = shallow(<FormSection {...props} />)
      expect(wrapper.state()).to.be.null
    })
  })
})

describe('Output', () => {
  let wrapper = shallow(<FormSection {...props} />)

  it('outputs 1 FormGroup', () => {
    expect(wrapper.find('FormGroup').length).to.equal(1)
  })

  it('outputs 1 ControlLabel', () => {
    expect(wrapper.find('ControlLabel').length).to.equal(1)
  })

  it('outputs 1 FormControl', () => {
    expect(wrapper.find('FormControl').length).to.equal(1)
  })

  it('outputs 1 Feedback', () => {
    expect(wrapper.find('FormControlFeedback').length).to.equal(1)
  })

  it('outputs 1 HelpBlock', () => {
    expect(wrapper.find('HelpBlock').length).to.equal(1)
  })

  describe('HelpBlock', () => {
    describe('when showHelpBlock is true', () => {
      it('should be displayed', () => {
        let parentState = _.merge({}, props.parentState, {
          fieldname: { showHelpBlock: true }
        })
        wrapper.setProps({ parentState })
        expect(wrapper.find('HelpBlock').prop('className')).to.equal('')
      })
    })

    describe('when showHelpBlock is false', () => {
      it('should be hidden', () => {
        let parentState = _.merge({}, props.parentState, {
          fieldname: { showHelpBlock: false }
        })
        wrapper.setProps({ parentState })
        expect(wrapper.find('HelpBlock').prop('className')).to.equal('hidden')
      })
    })
  })
})

describe('Functions', () => {
  describe('onChange', () => {
    it('calls the onChange prop with an event and identifier', () => {
      let onChangeProp = sinon.stub()
      let givenProps = _.merge({}, props, { onChange: onChangeProp })
      let wrapper = shallow(<FormSection {...givenProps} />)
      let event = new Event('change')

      wrapper.instance().onChange(event)
      expect(onChangeProp.calledOnce).to.be.true
      expect(onChangeProp.calledWithExactly(event, 'fieldname')).to.be.true
    })
  })

  describe('getValidationState', () => {
    describe('when validation should not be shown', () => {
      it('returns null', () => {
        let wrapper = shallow(<FormSection {...props} />)
        expect(wrapper.instance().getValidationState()).to.be.null
      })
    })

    describe('when validation should be shown', () => {
      it('returns "success" if the field value is valid', () => {
        let givenProps = _.merge({}, props, {
          parentState: {
            fieldname: { showFeedback: true, isValid: true }
          }
        })
        let wrapper = shallow(<FormSection {...givenProps} />)
        expect(wrapper.instance().getValidationState()).to.equal('success')
      })

      it('returns "error" if the field value is invalid', () => {
        let givenProps = _.merge({}, props, {
          parentState: {
            fieldname: { showFeedback: true, isValid: false }
          }
        })
        let wrapper = shallow(<FormSection {...givenProps} />)
        expect(wrapper.instance().getValidationState()).to.equal('error')
      })
    })
  })
})

describe('Events', () => {
  describe('When the value of the FormControl is changed', () => {
    it('triggers the onChange function', () => {
      let onChange = sinon.stub(FormSection.prototype, 'onChange')
      let wrapper = shallow(<FormSection {...props} />)
      wrapper.find('FormControl').simulate('change')
      expect(onChange.calledOnce).to.be.true
    })
  })
})
