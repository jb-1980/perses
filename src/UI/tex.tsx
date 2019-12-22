import * as React from "react"
import katex from "katex"
import "katex/dist/katex.min.css"
//import "katex/dist/fonts/"

export const TeX = ({ texString }) => {
  const _texString = texString
    // Replace uses of \begin{align}...\end{align} which KaTeX doesn't
    // support (yet) with \begin{aligned}...\end{aligned} which renders
    // the same is supported by KaTeX.  It does the same for align*.
    // TODO(kevinb) update content to use aligned instead of align.
    .replace(/\{align[*]?\}/g, "{aligned}")
    // Replace non-breaking spaces with regular spaces.
    .replace(/[\u00a0]/g, " ")
  const tex = katex.renderToString(_texString)
  return <span dangerouslySetInnerHTML={{ __html: tex }} />
}
