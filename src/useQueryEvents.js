import {useQuery} from 'urql'
import {useBooleanDidChange} from './useBooleanDidChange'
import {forEachResObjValue} from './utils'

export function useQueryEvents (setState, ...queryProps) {
  const queryTuple = useQuery(...queryProps)
  const [res] = queryTuple
  const isFetchingQuery = !!(res && res.fetching)
  const fetchingDidChange = useBooleanDidChange({value: isFetchingQuery})
  if (fetchingDidChange && !isFetchingQuery) {
    forEachResObjValue(res, (value) => setState(value))
  }
  return queryTuple
}
