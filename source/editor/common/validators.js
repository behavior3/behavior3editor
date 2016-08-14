


export function isId(str) {
  if (typeof str !== 'string') return false
  if (str.length !== 20) return false

  return true
}

export function contains(item, collection) {
  if (Array.isArray(collection)) {
    return collection.indexOf(item) >= 0
  } else {
    return typeof collection[item] !== 'undefined'
  }
}
