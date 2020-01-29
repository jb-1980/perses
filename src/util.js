export const rWidgetParts = /^\[\[☃ (([a-z-]+) ([0-9]+))\]\]$/
export const rWidgetRule = /^\[\[☃ (([a-z-]+) ([0-9]+))\]\]/
export const rTypeFromWidgetId = /^([a-z-]+) ([0-9]+)$/

export const debounce = (func, wait, immediate) => {
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
}

// adapted from https://github.com/epoberezkin/fast-deep-equal/blob/master/src/index.jst
export const objectsAreEqual = (a, b) => {
  if (a === b) return true

  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor) return false

    let length, i, keys

    // array case
    if (Array.isArray(a)) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0; )
        if (!objectsAreEqual(a[i], b[i])) return false
      return true
    }

    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf()
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString()

    keys = Object.keys(a)
    length = keys.length
    if (length !== Object.keys(b).length) return false

    for (i = length; i-- !== 0; ) {
      let key = keys[i]
      if (!objectsAreEqual(a[key], b[key])) return false
    }

    return true
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b
}

// some _ (underscore) functions not fully implemented in es6
export const isObject = obj => {
  const type = typeof obj
  return type === "function" || (type === "object" && !!obj)
}

export const isString = obj => {
  return Object.prototype.toString.call(obj) === "[object String]"
}
