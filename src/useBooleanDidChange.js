import React from 'react'

export function useBooleanDidChange ({value}) {
  const bool = !!value
  const ref = React.useRef(undefined)
  let stateDidChange = false
  if (ref.current !== undefined) {
    stateDidChange = ref.current !== bool
  }
  ref.current = bool
  return stateDidChange
}
