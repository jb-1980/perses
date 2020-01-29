import * as React from "react"
import { EditorState, Modifier } from "draft-js"
import "draft-js/dist/Draft.css"

import { Editors } from "../widgets"
import { templates } from "../templates"

type questionType = {
  content: string
  images: {}
  widgets: { [key: string]: any }
}

type contextTypes = {
  question: questionType
  hints: {}
  editorState: EditorState
  setQuestion: React.Dispatch<React.SetStateAction<questionType>>
  updateEditorContent: (newEditorState: EditorState) => void
  setWidgetProps: (widgetId: string, newProps: {}) => void
  insertWidget: (widgetId: string) => any
  insertTemplate: (templateName: string) => any
  serialize: () => { question: questionType; hints: {} }
}

const EditorContext = React.createContext<Partial<contextTypes>>({
  question: {
    content: "",
    images: {},
    widgets: {},
  },
  hints: {},
})

type editorContextProps = {
  initialContents: {
    question: questionType
    hints: {}
  }
  children: any
}

const EditorContextProvider = ({
  initialContents,
  children,
}: editorContextProps) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )
  const [question, setQuestion] = React.useState(initialContents.question)
  const [hints, setHints] = React.useState(initialContents.hints)

  const updateEditorContent = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
    setQuestion({
      ...question,
      content: newEditorState.getCurrentContent().getPlainText("\n"),
    })
  }

  const insertWidget = (widgetType: string) => {
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

  const insertTemplate = (templateName: string) => {
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
  const setWidgetProps = (widgetId: string, newProps: {}) => {
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

  const serialize = () => {
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
        editorState,
        setQuestion,
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
