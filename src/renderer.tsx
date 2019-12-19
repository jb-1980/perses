import * as React from "react"
import ReactMarkdown from "react-markdown"

export const Renderer = ({ content }) => {
  console.log({ content })
  return <ReactMarkdown source={content} />
}
