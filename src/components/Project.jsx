import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Project extends Component {
  render() {
    return (
      <div>
        A project!
      </div>
    )
  }
}

Project.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired
}
