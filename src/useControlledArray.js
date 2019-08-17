import React from 'react'
import {getProp, addItem, removeItem} from './utils'

const DEFAULT_KEY = 'id'

export function useControlledArray (options = {}) {
  let key = options.key || DEFAULT_KEY
  if (typeof key === 'string') {
    key = getProp(key)
  }
  const initialValue = options.initialValue || []
  let [array, setState] = React.useState(initialValue)
  if (options.sort) {
    const {sort} = options
    const _setState = setState
    setState = (array) => _setState(sort(array))
  }
  const add = (item) => setState(addItem(key, array, item))
  const remove = (item) => setState(removeItem(key, array, item))
  return [array, setState, add, remove]
}
