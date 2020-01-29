import { CategorizerRenderer } from "./categorizer-renderer"
import CategorizerEditor from "./categorizer-editor"

export const Editors = [CategorizerEditor]

type RenderersType = {
  type: string
  displayName: string
  widget: ({
    getNewProps,
  }: {
    getNewProps: (newProps: {}) => void
  }) => JSX.Element
  grade: (props: {}, options: {}) => boolean
  transform: (options: {}) => {}
}
export const Renderers = <Array<RenderersType>>[CategorizerRenderer]
