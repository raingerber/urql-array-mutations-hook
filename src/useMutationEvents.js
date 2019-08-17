import React from 'react'
import {useMutation} from 'urql'
import {useBooleanDidChange} from './useBooleanDidChange'
import {forEachResObjValue} from './utils'

export function useMutationEvents (callback, ...args) {
  const ref = React.useRef(null)
  if (!ref.current) {
    ref.current = {
      variables: null,
      data: null,
      error: null
    }
  }
  const [res, execute] = useMutation(...args)
  const {data, error} = res
  const fetching = !!res.fetching
  const fetchingDidChange = useBooleanDidChange({value: fetching})
  // if (data && !ref.current.data) {}
  // if (error && !ref.current.error) {}
  ref.current.data = data
  ref.current.error = error
  if (!fetching) {
    ref.current.variables = null
    if (fetchingDidChange) {
      forEachResObjValue(res, callback)
    }
  }
  return [res, wrapExecute(ref, execute)]
}

export function wrapExecute (ref, execute) {
  return (variables, ...args) => {
    ref.current.variables = variables
    execute(variables, ...args)
  }
}
