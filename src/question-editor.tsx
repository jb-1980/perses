import * as React from "react"
import { css } from "emotion"
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
import {
  EditorContextProvider,
  useEditorContext,
} from "./contexts/editor-context"
import {
  RendererContextProvider,
  useRendererContext,
} from "./contexts/renderer-context"
import { objectsAreEqual } from "./util"

export const QuestionEditor = () => {
  const { serialize } = useEditorContext()
  return (
    <div
      className={css`
        display: flex;
      `}
    >
      <div
        className={css`
          flex: 1;
        `}
      >
        <EditorView />
      </div>
      <div
        className={css`
          flex: 2;
          margin: 0 10px;
          padding: 20px;
          border: thin solid var(--color-darkText);
          border-radius: 5px;
          box-shadow: 0px 0px 5px 1px var(--color-primary);
          height: 100%;
        `}
      >
        <RendererContextProvider>
          <EditRenderer questionState={serialize()} />
        </RendererContextProvider>
      </div>
    </div>
  )
}

const EditRenderer = ({ questionState }) => {
  const { resetQuestion, calculateGrade } = useRendererContext()
  let [currentState, setCurrentState] = React.useState(questionState)
  let [isCorrect, setIsCorrect] = React.useState(null)
  if (!objectsAreEqual(currentState, questionState)) {
    resetQuestion(questionState)
    setCurrentState(questionState)
  }

  return (
    <div>
      <Renderer />
      <div style={{ float: "right" }}>
        <div style={{ display: "inline-block", marginRight: 5 }}>
          {isCorrect === null ? null : isCorrect ? "Correct!" : "Incorrect"}
        </div>
        <button
          className={css`
            background-color: var(--color-primary);
            color: var(--color-lightText);
            border: none;
            padding: 5px;
            border-radius: 3px;
            width: 50px;
            height: 30px;
          `}
          onClick={() => setIsCorrect(calculateGrade())}
        >
          Grade
        </button>
      </div>
    </div>
  )
}

const WidgetSelect = ({ onChange, editors }) => (
  <select value="default" onChange={onChange}>
    <option value="default">Insert a widget…</option>
    {editors.map(({ type, displayName }) => (
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
    widgetEditors,
  } = useEditorContext()

  console.log({ editorQuestion: question })
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
          <WidgetSelect
            editors={widgetEditors}
            onChange={e => insertWidget(e.target.value)}
          />
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
