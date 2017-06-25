import React, { Component } from 'react'
import Project from './Project'

export default class Projects extends Component {
  render() {
    return (
      <main className="container">
        <Project name="A Name" description="A desc" imagePath="A/path" />
      </main>
    )
  }
}
