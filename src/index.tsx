import * as React from "react"
import { render } from "react-dom"

import "./styles.css"
import { QuestionEditor } from "./question-editor"

function App() {
  return (
    <div className="App">
      <QuestionEditor />
    </div>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
