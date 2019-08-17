import {useControlledArray} from './useControlledArray'
import {useQueryEvents} from './useQueryEvents'
import {useMutationEvents} from './useMutationEvents'

const EMPTY_ARRAY = []

export function useArrayMutations (props) {
  let [array, setState, add, remove] = useControlledArray({
    initialValue: EMPTY_ARRAY,
    sort: props.sort
  })
  add = useMutationEvents(add, props.add)
  remove = useMutationEvents(remove, props.remove)
  let queryArgs = props.get
  if (typeof queryArgs === 'string') {
    queryArgs = {query: queryArgs}
  }
  const query = useQueryEvents(setState, queryArgs)
  return [array, add, remove, query]
}
