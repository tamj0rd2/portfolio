import React, { Component } from 'react'
import About from './About'
import Contact from './Contact'
import Projects from './Projects'

class App extends Component {
  render() {
    return (
      <div>
        <About />
        <Projects />
        <Contact />
      </div>
    )
  }
}

export default App
