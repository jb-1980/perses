import * as React from "react"
import { Editor, EditorState, Modifier } from "draft-js"
import "draft-js/dist/Draft.css"

import { templates } from "./templates"
import {
  Panel,
  PanelHeading,
  PanelTitle,
  PanelBody,
  PanelFooter,
  Pills,
} from "./UI"
import { Renderer } from "./renderer"
import { Editors } from "./widgets"

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_EDITOR_STATE": {
      return {
        ...state,
        question: {
          ...state.question,
          content: action.editorState,
        },
      }
    }
    case "INSERT_WIDGET": {
      const currentContent = action.editorState.getCurrentContent()
      const currentSelection = action.editorState.getSelection()

      const { widgets } = state.question

      const widget = Modifier.replaceText(
        currentContent,
        currentSelection,
        `[[☃${action.widget}]]`
      )

      const newEditorState = EditorState.push(
        action.editorState,
        widget,
        "insert-characters"
      )

      return {
        ...state,
        question: {
          ...state.question,
          content: newEditorState,
          widgets: {
            [action.widget]: Editors.find(w => w.name === action.widget),
          },
        },
      }
    }
    case "INSERT_TEMPLATE": {
      const currentContent = action.editorState.getCurrentContent()
      const currentSelection = action.editorState.getSelection()

      const template = Modifier.replaceText(
        currentContent,
        currentSelection,
        templates[action.template]
      )

      const newEditorState = EditorState.push(
        action.editorState,
        template,
        "insert-characters"
      )

      return {
        ...state,
        question: {
          ...state.question,
          content: newEditorState,
        },
      }
    }
  }
}

export const QuestionEditor = props => {
  const [{ question, hints }, dispatch] = React.useReducer(reducer, {
    question: {
      content: EditorState.createEmpty(),
      images: {},
      widgets: {},
    },
    hints: {},
  })
  const [view, setView] = React.useState("editor")
  const tabs = [
    { id: "editor", name: "Editor" },
    { id: "renderer", name: "Renderer" },
  ]

  const currentView = {
    editor: (
      <EditorView
        widgets={question.widgets}
        editorState={question.content}
        dispatch={dispatch}
      />
    ),
    renderer: (
      <Renderer
        content={question.content.getCurrentContent().getPlainText("\n")}
      />
    ),
  }[view]

  return (
    <div>
      <Pills tabs={tabs} activeTab={view} clickHandler={setView} />
      {currentView}
    </div>
  )
}

const WidgetSelect = ({ onChange }) => (
  <select value="default" onChange={onChange}>
    <option value="default">Insert a widget…</option>
    {Editors.map(({ name }) => (
      <option value={name} key={name}>
        {name}
      </option>
    ))}
  </select>
)

const EditorView = ({ widgets, editorState, dispatch }) => {
  return (
    <div>
      <Panel>
        <PanelHeading>
          <PanelTitle>Question</PanelTitle>
        </PanelHeading>
        <PanelBody>
          <Editor
            editorState={editorState}
            onChange={editorState =>
              dispatch({ type: "SET_EDITOR_STATE", editorState })
            }
            placeholder="Type your question here…"
          />
        </PanelBody>
        <PanelFooter>
          <WidgetSelect
            onChange={e =>
              dispatch({
                type: "INSERT_WIDGET",
                widget: e.target.value,
                editorState,
              })
            }
          />
          <select
            value="default"
            onChange={e =>
              dispatch({
                type: "INSERT_TEMPLATE",
                template: e.target.value,
                editorState,
              })
            }
          >
            <option value="default">Insert a template…</option>
            {Object.keys(templates).map(t => (
              <option value={t} key={t}>
                {t}
              </option>
            ))}
          </select>
        </PanelFooter>
      </Panel>
      {Object.entries(widgets).map(([key, value]) => {
        console.log({ key, value })
        const Widget = value.editor
        return (
          <div key={key}>
            <Widget />
          </div>
        )
      })}
    </div>
  )
}
