export const Util = {
  rWidgetParts: /^\[\[☃ (([a-z-]+) ([0-9]+))\]\]$/,
  rWidgetRule: /^\[\[☃ (([a-z-]+) ([0-9]+))\]\]/,
  rTypeFromWidgetId: /^([a-z-]+) ([0-9]+)$/,
  snowman: "☃",

  // some _ (underscore) functions not fully implemented in es6
  isObject: obj => {
    const type = typeof obj
    return type === "function" || (type === "object" && !!obj)
  },

  isString: obj => {
    return Object.prototype.toString.call(obj) === "[object String]"
  },

  debounce: (func, wait, immediate) => {
    let timeout

    return function executedFunction() {
      const context = this
      const args = arguments

      const later = () => {
        timeout = null
        if (!immediate) func.apply(context, args)
      }

      const callNow = immediate && !timeout

      clearTimeout(timeout)
      timeout = setTimeout(later, wait)

      if (callNow) func.apply(context, args)
    }
  },
}
