export const KEYS_TO_IGNORE = ['__typename']

export const getProp = (prop) => (item) => item && item[prop]

export function forEachResObjValue (res, callback) {
  if (!res || !res.data) {
    return
  }
  const keys = Object.keys(res.data)
  keys.forEach((key) => {
    if (KEYS_TO_IGNORE.includes(key)) {
      return
    }
    const value = res.data[key]
    callback(value)
  })
}

export const addItem = (getKey, array, itemData) => {
  const key = getKey(itemData)
  if (key) {
    let wasAdded = false
    array = array.map((item) => {
      if (getKey(item) === key) {
        wasAdded = true
        return itemData
      }
      return item
    })
    if (!wasAdded) {
      // This array is the result of array.map,
      // so the push does not mutate the input
      array.push(itemData)
    }
  }
  return array
}

export const removeItem = (getKey, array, itemData) => {
  const key = getKey(itemData)
  if (key) {
    const newArray = array.filter((item) => {
      return getKey(item) !== key
    })
    if (newArray.length !== array.length) {
      array = newArray
    }
  }
  return array
}
