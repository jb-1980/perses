import * as React from "react"
import { EditorState, ContentState, Modifier } from "draft-js"
import "draft-js/dist/Draft.css"

import { Editors } from "../widgets"
import { templates } from "../templates"

const EditorContext = React.createContext()

const initialEditorContents = {
  question: {
    content: "",
    images: {},
    widgets: {},
  },
  hints: {},
}

const EditorContextProvider = ({ children }) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )
  const [question, setQuestion] = React.useState(initialEditorContents.question)
  const [hints, setHints] = React.useState(initialEditorContents.hints)

  const updateEditorContent = newEditorState => {
    setEditorState(newEditorState)
    setQuestion({
      ...question,
      content: newEditorState.getCurrentContent().getPlainText("\n"),
    })
  }

  const insertWidget = widgetType => {
    const currentContent = editorState.getCurrentContent()
    const currentSelection = editorState.getSelection()

    const { widgets } = question
    const nthWidget = Object.keys(widgets)
      .filter(id => widgets[id].type === widgetType)
      .map(id => +id.split(" ")[1])
      .reduce((maxId, currId) => Math.max(maxId, currId), 0)

    const widgetId = `${widgetType} ${nthWidget + 1}`
    const widget = Modifier.replaceText(
      currentContent,
      currentSelection,
      `[[☃ ${widgetId}]]`
    )

    const newEditorState = EditorState.push(
      editorState,
      widget,
      "insert-characters"
    )

    setEditorState(newEditorState)
    setQuestion({
      ...question,
      content: newEditorState.getCurrentContent().getPlainText("\n"),
      widgets: {
        ...question.widgets,
        [widgetId]: Editors.find(w => w.type === widgetType),
      },
    })
  }

  const insertTemplate = templateName => {
    const currentContent = editorState.getCurrentContent()
    const currentSelection = editorState.getSelection()

    const template = Modifier.replaceText(
      currentContent,
      currentSelection,
      templates[templateName]
    )

    const newEditorState = EditorState.push(
      editorState,
      template,
      "insert-characters"
    )

    updateEditorContent(newEditorState)
  }

  /* This function should only be used in a widget editor as a means of updating
   * the widget's options in the question object
   */
  const setWidgetProps = (widgetId, newProps) => {
    const widget = question.widgets[widgetId]

    // There should always be a widget because setWidgetProps should only be called
    // inside a widget editor
    if (!widget) {
      throw new Error(
        `No widget found for ${widgetId}, was setWidgetProps used outside of widget editor?`
      )
    }

    setQuestion({
      ...question,
      widgets: {
        ...question.widgets,
        [widgetId]: { ...widget, options: newProps },
      },
    })
  }

  const resetQuestion = nextState => {
    console.log({ nextState })
    if (!nextState) {
      setQuestion(initialEditorContents.question)
      setEditorState(EditorState.createEmpty())
      setHints(initialEditorContents.hints)
    } else {
      let _question = {
        ...nextState.question,
        widgets: Object.entries(nextState.question.widgets).reduce(
          (acc, [id, widget]) => {
            acc[id] = {
              ...Editors.find(w => w.type === widget.type),
              ...widget,
            }
            return acc
          },
          {}
        ),
      }
      setQuestion(_question)
      let contentState = ContentState.createFromText(_question.content)
      console.log({ contentState })
      let _editorState = EditorState.createWithContent(contentState)
      setEditorState(_editorState)
      setHints(nextState.hints)
    }
  }
  const serialize = () => {
    console.log({ serializedQuestion: question })
    const _widgets = Object.entries(question.widgets).reduce(
      (acc, [key, value]) => {
        const { editor, transform, options, ...cleanWidget } = value
        acc[key] = { ...cleanWidget, options: transform(options) }
        return acc
      },
      {}
    )
    return { question: { ...question, widgets: _widgets }, hints }
  }

  return (
    <EditorContext.Provider
      value={{
        question,
        hints,
        widgetEditors: Editors,
        editorState,
        setQuestion,
        resetQuestion,
        updateEditorContent,
        setWidgetProps,
        insertWidget,
        insertTemplate,
        serialize,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

const useEditorContext = () => {
  const editorContext = React.useContext(EditorContext)

  if (editorContext === undefined) {
    throw new Error("useEditorContext must be used in an EditorContextProvider")
  }

  return editorContext
}

export { EditorContextProvider, useEditorContext }
