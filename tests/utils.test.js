import {getProp, forEachResObjValue, addItem, removeItem} from '../src/utils'

const getKeyById = getProp('id')

describe('getProp', () => {
  it('does not modify falsy input', () => {
    expect(getKeyById()).toBe(undefined)
    expect(getKeyById(null)).toBe(null)
    expect(getKeyById('')).toBe('')
    expect(getKeyById({})).toBe(undefined)
  })
  it('returns the ids for each object', () => {
    expect(getKeyById({id: null})).toBe(null)
    expect(getKeyById({id: true})).toBe(true)
    expect(getKeyById({id: false})).toBe(false)
    expect(getKeyById({id: 'i-dee'})).toBe('i-dee')
  })
  it('can use a null key', () => {
    expect(getProp(null)({[null]: 'i-dee'})).toBe('i-dee')
  })
})

describe('forEachResObjValue', () => {
  it('ignores falsy input and the __typename key', () => {
    const callback = jest.fn()
    forEachResObjValue(null, callback)
    forEachResObjValue({data: null}, callback)
    forEachResObjValue({data: {__typename: 'Item'}}, callback)
    expect(callback).not.toHaveBeenCalled()
  })
  it('passes data to the callback', () => {
    const callback = jest.fn()
    const resObj = {
      data: {
        [null]: 'value', // This will be ignored
        __typename: 'Item',
        undefined: undefined,
        null: null,
        emptyString: '',
        zero: 0,
        trueValue: true,
        falseValue: false,
        objectValue: {
          stringValue: 'red',
          numberValue: 7
        }
      }
    }
    forEachResObjValue(resObj, callback)
    expect(callback).toHaveBeenCalledTimes(7)
    expect(callback).toHaveBeenCalledWith(resObj.data.undefined)
    expect(callback).toHaveBeenCalledWith(resObj.data.null)
    expect(callback).toHaveBeenCalledWith(resObj.data.emptyString)
    expect(callback).toHaveBeenCalledWith(resObj.data.zero)
    expect(callback).toHaveBeenCalledWith(resObj.data.trueValue)
    expect(callback).toHaveBeenCalledWith(resObj.data.falseValue)
    expect(callback).toHaveBeenCalledWith(resObj.data.objectValue)
  })
})

describe('addItem', () => {
  it('returns the input array when the new item does not have a key', () => {
    const itemData = {
      ID: 'id-0', // 'ID' !== 'id'
      value: 'NEW_VALUE'
    }
    const array = [
      {
        id: 'id-0',
        value: 'value-0'
      }
    ]
    const output = addItem(getKeyById, array, itemData)
    expect(output).toBe(array) // Does not create a new array
    expect(output).toEqual([
      {
        id: 'id-0',
        value: 'value-0'
      }
    ])
  })
  it('overwrites all matching items', () => {
    const itemData = {
      id: 'id-to-overwrite',
      value: 'NEW_VALUE'
    }
    const array = [
      {
        id: 'id-0',
        value: 'value-0'
      },
      {
        id: itemData.id,
        value: 'value-1'
      },
      {
        id: 'id-1',
        value: 'value-2'
      },
      {
        id: itemData.id,
        value: 'value-3'
      }
    ]
    const output = addItem(getKeyById, array, itemData)
    expect(output).toEqual([
      {
        id: 'id-0',
        value: 'value-0'
      },
      {
        id: itemData.id,
        value: 'NEW_VALUE'
      },
      {
        id: 'id-1',
        value: 'value-2'
      },
      {
        id: itemData.id,
        value: 'NEW_VALUE'
      }
    ])
  })
  it('adds the item when no existing matches are found', () => {
    const itemData = {
      id: 'id-1',
      value: 'NEW_VALUE'
    }
    const array = [
      {
        id: 'id-0',
        value: 'value-0'
      }
    ]
    const output = addItem(getKeyById, array, itemData)
    expect(output).not.toBe(array) // Still creates a new array
    expect(output).toEqual([
      {
        id: 'id-0',
        value: 'value-0'
      },
      {
        id: 'id-1',
        value: 'NEW_VALUE'
      }
    ])
  })
})

describe('removeItem', () => {
  it('returns the input array when the new item does not have a key', () => {
    const itemData = {
      ID: 'id-0' // 'ID' !== 'id'
    }
    const array = [
      {
        id: 'id-0',
        value: 'value-0'
      }
    ]
    const output = removeItem(getKeyById, array, itemData)
    expect(output).toBe(array) // Does not create a new array
    expect(output).toEqual([
      {
        id: 'id-0',
        value: 'value-0'
      }
    ])
  })
  it('returns the input array when no matches are found', () => {
    const itemData = {
      id: 'id-1'
    }
    const array = [
      {
        id: 'id-0',
        value: 'value-0'
      }
    ]
    const output = removeItem(getKeyById, array, itemData)
    expect(output).toBe(array) // Does not create a new array
    expect(output).toEqual([
      {
        id: 'id-0',
        value: 'value-0'
      }
    ])
  })
  it('removes all matching items', () => {
    const itemData = {
      id: 'id-to-remove'
    }
    const array = [
      {
        id: 'id-0',
        value: 'value-0'
      },
      {
        id: itemData.id,
        value: 'value-1'
      },
      {
        id: itemData.id,
        value: 'value-2'
      },
      {
        id: 'id-1',
        value: 'value-3'
      }
    ]
    const output = removeItem(getKeyById, array, itemData)
    expect(output).toEqual([
      {
        id: 'id-0',
        value: 'value-0'
      },
      {
        id: 'id-1',
        value: 'value-3'
      }
    ])
  })
})
