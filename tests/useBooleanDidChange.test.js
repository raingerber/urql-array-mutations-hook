import {renderHook} from '@testing-library/react-hooks'
import {useBooleanDidChange} from '../src/useBooleanDidChange'

describe('useBooleanDidChange', () => {
  it('returns true when the "value" value changes', () => {
    const {result, rerender} = renderHook((props) => {
      return useBooleanDidChange(props)
    }, {
      initialProps: {
        value: false
      }
    })
    const didChange = () => result.current
    expect(didChange()).toBe(false)

    rerender({value: false})
    expect(didChange()).toBe(false)

    rerender({value: true})
    expect(didChange()).toBe(true)

    rerender({value: true})
    expect(didChange()).toBe(false)

    rerender({value: false})
    expect(didChange()).toBe(true)
  })
})
