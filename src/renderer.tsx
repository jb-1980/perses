import * as React from "react"
import PersesMarkdown from "./perses-markdown"
import { Renderers } from "./widgets"
import { useRendererContext } from "./contexts/renderer-context"

export const Renderer = () => {
  const {
    question: { content, widgets },
    hints,
    calculateGrade,
    setWidgetProps,
  } = useRendererContext()

  const [isCorrect, setIsCorrect] = React.useState(null)
  const renderWidget = widgetId => {
    const { type, options } = widgets[widgetId]
    const { widget: WidgetRenderer } = Renderers.find(w => w.type === type)

    return (
      <WidgetRenderer
        key={widgetId}
        getNewProps={newProps => setWidgetProps(widgetId, newProps)}
        {...options}
      />
    )
  }

  const getOutput = ast => {
    let output = []
    if (Array.isArray(ast)) {
      ast.forEach(node => {
        output.push(...getOutput(node))
      })
    } else if (Array.isArray(ast.content)) {
      ast.content.forEach(node => {
        output.push(...getOutput(node))
      })
    } else if (ast.type === "widget") {
      output.push(renderWidget(ast.id))
    } else {
      output.push(PersesMarkdown.basicOutput(ast))
    }

    return output
  }

  const ast = PersesMarkdown.parse(content)
  const output = getOutput(ast)
  return (
    <div>
      {output}
      <p>{isCorrect === null ? null : isCorrect ? "correct" : "Incorrect"}</p>
      <button onClick={() => setIsCorrect(calculateGrade())}>grade</button>
    </div>
  )
}
