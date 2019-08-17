import {renderHook, act} from '@testing-library/react-hooks'
import {useControlledArray} from '../src/useControlledArray'

// These functions make it easier to interact
// with the return value from useControlledArray
const currentArray = (result) => result.current[0]
const setState = (result, ...args) => result.current[1](...args)
const addValue = (result, ...args) => result.current[2](...args)
const removeValue = (result, ...args) => result.current[3](...args)

describe('useControlledArray - options', () => {
  it('returns an empty array when no options are used', () => {
    const {result} = renderHook(() => useControlledArray())
    expect(result.current[0]).toEqual([])
    expect(result.current).toHaveLength(4)
  })
  it('returns an empty array when initialValue is null', () => {
    const props = {initialValue: null}
    const {result} = renderHook(() => useControlledArray(props))
    expect(result.current[0]).toEqual([])
    expect(result.current).toHaveLength(4)
  })
  it('returns the initialValue when it is truthy', () => {
    const props = {initialValue: [{id: 'id'}]}
    const {result} = renderHook(() => useControlledArray(props))
    expect(result.current[0]).toEqual([{id: 'id'}])
    expect(result.current).toHaveLength(4)
  })
})

describe('useControlledArray - updating the array', () => {
  it('uses "id" as the key property', () => {
    return testArrayMutations('id')
  })
  it('uses a custom string as the key property', () => {
    const getKey = 'other_id'
    return testArrayMutations('other_id', getKey)
  })
  it('uses a custom function to generate the key property', () => {
    const getKey = item => item && item.other_id
    return testArrayMutations('other_id', getKey)
  })
  async function testArrayMutations (key, getKey) {
    const {result, waitForNextUpdate} = renderHook((props) => {
      return useControlledArray(props)
    }, {
      initialProps: {
        initialValue: [],
        key: getKey
      }
    })
    expect(currentArray(result)).toEqual([])
    await act(async () => {
      setState(result, [{[key]: 'B', text: 'text'}])
      await waitForNextUpdate()
      expect(currentArray(result)).toEqual([{[key]: 'B', text: 'text'}])

      addValue(result, {
        [key]: 'B',
        text: 'updated_text'
      })
      expect(currentArray(result)).toEqual([{[key]: 'B', text: 'updated_text'}])

      addValue(result, {
        [key]: 'A',
        text: 'new_text'
      })
      expect(currentArray(result)).toEqual([
        {[key]: 'B', text: 'updated_text'},
        {[key]: 'A', text: 'new_text'}
      ])

      removeValue(result, {
        [key]: 'B',
        text: 'new_text'
      })
      expect(currentArray(result)).toEqual([
        {[key]: 'A', text: 'new_text'}
      ])
    })
  }
})
