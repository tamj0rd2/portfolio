import { expectOne } from '../testHelpers'
import { shallow } from 'enzyme'

import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

describe('output', () => {
  let wrapper = shallow(<App />)

  it('renders an About section', () => {
    expectOne('About', wrapper)
  })

  it('renders a Projects section', () => {
    expectOne('Projects', wrapper)
  })

  it('renders a Contact section', () => {
    expectOne('Contact', wrapper)
  })
})
