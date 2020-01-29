import * as React from "react"
import { render } from "react-dom"
import uuidv4 from "uuid/v4"

import { QuestionEditor } from "./question-editor"
import {
  EditorContextProvider,
  useEditorContext,
} from "./contexts/editor-context"
import "./styles.css"

// Used to save question. I create it as a new component becuase I need access
// to the serialize method from the editor-context. So I will place it inside
// an EditorContextProvider in the QuestionWrapper component below.
const SaveQuestionButton = ({ onClick }) => {
  const { serialize } = useEditorContext()

  const handleClick = () => {
    let questionData = serialize()
    onClick(questionData)
  }
  return <button onClick={handleClick}>Save Question</button>
}

// Used to select a new question for editing. I create it as a separate component because
// I need to access the setQuestion method from the editor-context. So I will place it
// inside an EditorContextProvider in the QuestionWrapper component below.
const SelectQuestion = ({ onChange, questions }) => {
  const { resetQuestion } = useEditorContext()

  const onSelect = questionId => {
    if (questionId === "default") return
    if (questionId === "create") {
      resetQuestion(null)
    } else {
      console.log(questions[questionId])
      resetQuestion(questions[questionId].data)
    }
    onChange(questionId)
  }

  return (
    <select value="default" onChange={e => onSelect(e.target.value)}>
      <option value="default">Select a question...</option>
      <option value="create">Create new</option>
      {questions &&
        Object.values(questions).map(q => (
          <option key={q.id} value={q.id}>
            {q.name}
          </option>
        ))}
    </select>
  )
}

// We need to wrap our editor in a provider and supply it the question data.
const QuestionWrapper = () => {
  const [questions, setQuestions] = React.useState(null)
  const [question, setQuestion] = React.useState(null)
  // load our questions from a datastore. In this naive example I am just
  // loading from localStorage. In production you would likely have the
  // questions stored in a database and would need to perform and api call to the server.
  React.useEffect(() => {
    if (questions === null) {
      const _questions = localStorage.getItem("perses-questions")
      if (_questions) {
        setQuestions(JSON.parse(_questions))
      }
    }
  }, [questions])

  const saveQuestion = questionData => {
    if (questions === null) {
      // First question being saved
      let id = uuidv4()
      let name = "Question 1"
      let _question = { [id]: { id, name, data: questionData } }
      localStorage.setItem("perses-questions", JSON.stringify(_question))
      setQuestions(_question)
      setQuestion(_question)
    } else if (question === null) {
      //creating a new question
      let id = uuidv4()
      let numbers = Object.values(questions).map(q => +q.name.split(" ")[1])
      let next = Math.max(...numbers) + 1
      let name = `Question ${next}`
      let _question = { id, name, data: questionData }
      let _questions = { ...questions, [id]: _question }
      localStorage.setItem("perses-questions", JSON.stringify(_questions))
      setQuestions(_questions)
      setQuestion(_question)
    } else {
      let _question = { ...question, data: questionData }
      let _questions = { ...questions, [question.id]: _question }
      localStorage.setItem("perses-questions", JSON.stringify(_questions))
      setQuestions(_questions)
      setQuestion(_question)
    }
  }

  const selectQuestion = questionId => {
    if (questionId == "create") {
      setQuestion(null)
    } else {
      setQuestion(questions[questionId])
    }
  }

  console.log({ questions })
  console.log({ question })
  return (
    <EditorContextProvider initialContents={question ? question.data : null}>
      <SelectQuestion questions={questions} onChange={selectQuestion} />
      <SaveQuestionButton onClick={saveQuestion} />
      <QuestionEditor />
    </EditorContextProvider>
  )
}

const rootElement = document.getElementById("root")
render(<QuestionWrapper />, rootElement)
