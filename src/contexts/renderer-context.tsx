import React from "react"
import { Renderers } from "../widgets"

type widgetType = {
  type: string
  displayName: string
  widget: ({}) => JSX.Element
  graded: boolean
  options: {}
}

type transformedWidgets = widgetType & {
  grade: (options: {}, props: {}) => boolean
}

type questionType = {
  content: string
  images: {}
  widgets: { [key: string]: widgetType }
}

type contextType = {
  hints: {}
  question: questionType
  setWidgetProps: (widgetId: string, newProps: {}) => void
  calculateGrade: () => boolean
}
const Context = React.createContext<Partial<contextType>>({})

type contextProps = {
  itemData: {
    question: questionType
    hints: {}
  }
  children: any
}

const RendererContextProvider = ({ itemData, children }: contextProps) => {
  const transformedWidgets = Object.entries(itemData.question.widgets).reduce(
    (acc: { [key: string]: transformedWidgets }, [widgetId, widget]) => {
      const widgetRenderer = Renderers.find(w => w.type === widget.type)
      if (!widgetRenderer) {
        throw Error(
          `There is no widget of type ${widget?.type}. Was the renderer exported from widgets?`
        )
      }

      const { transform, grade } = widgetRenderer
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

  const setWidgetProps = (widgetId: string, newProps: {}) => {
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
