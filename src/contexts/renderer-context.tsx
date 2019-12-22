import * as React from "react"
import { Renderers } from "../widgets"

const Context = React.createContext()

const RendererContextProvider = ({ itemData, children }) => {
  const transformedWidgets = Object.entries(itemData.question.widgets).reduce(
    (acc, [widgetId, widget]) => {
      const { transform, grade } = Renderers.find(w => w.type === widget.type)
      acc[widgetId] = { ...widget, grade, options: transform(widget.options) }
      return acc
    },
    {}
  )

  const [question, setQuestion] = React.useState({
    ...itemData.question,
    widgets: transformedWidgets,
  })
  const { hints } = itemData

  const setWidgetProps = (widgetId, newProps) => {
    const widget = question.widgets[widgetId]
    setQuestion({
      ...question,
      widgets: {
        ...question.widgets,
        [widgetId]: { ...widget, options: newProps },
      },
    })
  }

  const calculateGrade = () => {
    const { widgets: userWidgets } = question
    const { widgets: itemWidgets } = itemData.question

    const iterable = Object.entries(userWidgets)

    for (let i = 0; i < iterable.length; i += 1) {
      let [widgetId, widget] = iterable[i]
      let { grade, options: props } = widget
      let { options } = itemWidgets[widgetId]
      if (!grade(props, options)) return false
    }

    return true
  }

  return (
    <Context.Provider
      value={{ hints, question, setWidgetProps, calculateGrade }}
    >
      {children}
    </Context.Provider>
  )
}

const useRendererContext = () => {
  const renderer = React.useContext(Context)

  if (renderer === undefined) {
    throw new Error(
      "useRendereContext must be used within a <RendererContextProvider>"
    )
  }

  return renderer
}

export { RendererContextProvider, useRendererContext }
