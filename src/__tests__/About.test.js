import { shallow } from 'enzyme'
import { expectOne } from '../testHelpers'

import React from 'react'
import About from '../components/About'

describe('Output', () => {
  let wrapper = shallow(<About />)

  it('renders a header element', () => {
    expectOne('header', wrapper)
  })

  it('renders a h1', () => {
    expectOne('h1', wrapper)
  })

  it('renders a h4', () => {
    expectOne('h4', wrapper)
  })
})
