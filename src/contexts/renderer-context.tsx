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

  // This data is used to store the widget data from the data store so it can be
  // accessed later when calculating the grade.
  const [questionWidgets, setQuestionWidgets] = React.useState(
    initialState.question.widgets
  )

  // This will hold the state of the currently rendered question. The context provider
  // will publicize a different method (resetQuestion) that will allow the developer to
  // change the context to a new question when the user has answered the current one.
  const [question, setQuestion] = React.useState({
    ...initialState.question,
    widgets: getTransformedWidgets(initialState.question.widgets),
  })

  // The hints should not be dynamic in the life of the question. The state is stored here
  // so that when another question is provided we can update the hints as well.
  const [hints, setHints] = React.useState(initialState.hints)

  // This is a method that will be passed as the getNewProps prop on the widget renderers.
  // This allows the renderer to push its changes back up to the question state.
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

  // This method should be consumed by the developer to tie to some effect when they want
  // to check if the user has entered a correct answer. The developer will wrap their
  // verfication logic in a RendererContext provider, and consume this method to check if
  // the user has entered the correct value.
  const calculateGrade = () => {
    const { widgets } = question

    const iterable = Object.entries(widgets)

    for (let i = 0; i < iterable.length; i += 1) {
      let [widgetId, widget] = iterable[i]
      let { grade, options: props } = widget
      let { options } = questionWidgets[widgetId]
      // each renderer has a grade function that will compare expected values (options) to
      // those provided by the user (props). If one of these functions returns false,
      // then the developer can know to mark as incorrect.
      if (!grade(props, options)) return false
    }

    // only returns true if all widgets evaluate as correct.
    return true
  }

  // Used when another question should be rendered. Usually after a user submits a question and
  // clicks the "next" button, however that may look in your application.
  const resetQuestion = nextState => {
    setQuestion({
      ...nextState.question,
      widgets: getTransformedWidgets(nextState.question.widgets),
    })
    setHints(nextState.hints)
    setQuestionWidgets(nextState.question.widgets)
  }

  return (
    <Context.Provider
      value={{
        hints,
        question,
        resetQuestion,
        setWidgetProps,
        calculateGrade,
        widgetRenderers: Renderers,
      }}
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
