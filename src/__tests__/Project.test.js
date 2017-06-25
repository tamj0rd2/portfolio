import { shallow, mount } from 'enzyme'
import { expect } from 'chai'

import React from 'react'
import Project from '../components/Project'

let testProps = {
  name: 'My First Project',
  description: 'A program that prints "Hello, World"',
  imagePath: 'MyFirstProject.png'
}

describe('Initial values', () => {
  let wrapper = mount(<Project {...testProps} />)

  describe('props', () => {
    let props = wrapper.props()

    it('has a name', () => {
      expect(props).to.haveOwnProperty('name')
      expect(props.name).to.be.a('string')
      expect(props.name).to.equal(testProps.name)
    })

    it('has a description', () => {
      expect(props).to.haveOwnProperty('description')
      expect(props.description).to.be.a('string')
      expect(props.description).to.equal(testProps.description)
    })

    it('has an image path', () => {
      expect(props).to.haveOwnProperty('imagePath')
      expect(props.imagePath).to.be.a('string')
      expect(props.imagePath).to.equal(testProps.imagePath)
    })
  })
})
