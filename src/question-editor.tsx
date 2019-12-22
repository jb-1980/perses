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
import {
  EditorContextProvider,
  useEditorContext,
} from "./contexts/editor-context"
import { RendererContextProvider } from "./contexts/renderer-context"

const initialEditorContents = {
  question: {
    content: "",
    images: {},
    widgets: {},
  },
  hints: {},
}

export const QuestionEditor = ({ initialContents = initialEditorContents }) => (
  <EditorContextProvider initialContents={initialContents}>
    <ProvidedQuestionEditor />
  </EditorContextProvider>
)

const ProvidedQuestionEditor = () => {
  const { serialize } = useEditorContext()
  const [view, setView] = React.useState("editor")
  const tabs = [
    { id: "editor", name: "Editor" },
    { id: "renderer", name: "Renderer" },
  ]

  const currentView = {
    editor: <EditorView />,
    renderer: (
      <RendererContextProvider itemData={serialize()}>
        <Renderer />
      </RendererContextProvider>
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
    {Editors.map(({ type, displayName }) => (
      <option value={type} key={type}>
        {displayName}
      </option>
    ))}
  </select>
)

const EditorView = () => {
  const {
    question,
    editorState,
    updateEditorContent,
    insertWidget,
    insertTemplate,
  } = useEditorContext()

  return (
    <div>
      <Panel>
        <PanelHeading>
          <PanelTitle>Question</PanelTitle>
        </PanelHeading>
        <PanelBody>
          <Editor
            editorState={editorState}
            onChange={updateEditorContent}
            placeholder="Type your question here…"
          />
        </PanelBody>
        <PanelFooter>
          <WidgetSelect onChange={e => insertWidget(e.target.value)} />
          <select
            value="default"
            onChange={e => insertTemplate(e.target.value)}
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
      {Object.entries(question.widgets).map(([key, value]) => {
        const WidgetEditor = value.editor
        return (
          <Panel key={key}>
            <PanelHeading>
              <PanelTitle>{key}</PanelTitle>
            </PanelHeading>
            <PanelBody>
              <WidgetEditor id={key} {...value.options} />
            </PanelBody>
          </Panel>
        )
      })}
    </div>
  )
}
