import Movable from "./movable.js"
import MovablePoint from "./movable-point.jsx"
import MovableLine from "./movable-line.js"
import MovablePolygon from "./movable-polygon.js"
//import KhanColors from "../../utils/colors"

const addMovablePoint = function(graphie, options) {
  const movable = new Movable(graphie, {})
  return new MovablePoint(graphie, movable, options)
}

const addMovableLine = function(graphie, options) {
  const movable = new Movable(graphie, {})
  return new MovableLine(graphie, movable, options)
}

const addMovablePolygon = function(graphie, options) {
  const movable = new Movable(graphie, {})
  return new MovablePolygon(graphie, movable, options)
}

// TODO: Maybe include this when we began to support mobile
// const addMaybeMobileMovablePoint = function(widget, extraProps) {
//   const commonStyle = {
//     stroke: KhanColors.INTERACTIVE,
//     fill: KhanColors.INTERACTIVE,
//   }

//   const normalStyle = { ...commonStyle, ...extraProps.normalStyle }

//   const highlightStyle = extraProps.highlightStyle

//   const props = {
//     normalStyle: normalStyle,
//     highlightStyle: highlightStyle,
//     tooltip: widget.props.showTooltips,
//     showHairlines: widget.showHairlines,
//     hideHairlines: widget.hideHairlines,
//   }

//   return addMovablePoint(widget.graphie, { ...extraProps, ...props })
// }

export default {
  MovablePoint,
  addMovablePoint,
  MovableLine,
  addMovableLine,
  MovablePolygon,
  addMovablePolygon,
  //addMaybeMobileMovablePoint,
}
