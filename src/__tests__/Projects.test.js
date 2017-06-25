import { shallow } from 'enzyme'
import { expect } from 'chai'
import { expectOne } from '../testHelpers'

import React from 'react'
import Projects from '../components/Projects'

describe('Output', () => {
  let wrapper = shallow(<Projects />)

  it('renders a main element', () => {
    expectOne('main', wrapper)
  })

  describe('main', () => {
    it('has the className "container"', () => {
      expect(wrapper.find('main').prop('className')).to.equal('container')
    })
  })
})
