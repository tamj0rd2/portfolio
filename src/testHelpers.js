import { expect } from 'chai'

export function expectOne(elemName, wrapper) {
  return expect(wrapper.find(elemName).length).to.equal(1)
}
