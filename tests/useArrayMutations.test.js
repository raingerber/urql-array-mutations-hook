import 'isomorphic-unfetch'

import React from 'react'
import {Provider, createClient} from 'urql'
import {wait} from '@testing-library/react'
import {renderHook, act} from '@testing-library/react-hooks'
import {useArrayMutations} from '../src/index'
import {createApp} from '../server/graphql-app'
import {options} from '../server/graphql-types'

const TEST_APP_PORT = 4000
const apiUrl = `http://localhost:${TEST_APP_PORT}`

let client
let app

beforeEach(() => {
  client = createClient({
    url: apiUrl
  })
  app = createApp({
    initialValue: [
      {
        id: 'one'
      }
    ],
    port: TEST_APP_PORT
  })
})

afterEach(() => {
  app.close()
})

describe('useArrayMutations', () => {
  it('uses a string as the query', () => {
    return act(async () => {
      const {result} = renderHook(useArrayMutations, {
        wrapper: (props) => <Provider {...props} value={client}/>,
        initialProps: {
          ...options,
          get: options.get.query
        }
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'one',
            __typename: 'Item'
          }
        ])
      })
    })
  })
  it('mutates the items array', () => {
    return act(async () => {
      const {result} = renderHook(useArrayMutations, {
        wrapper: (props) => <Provider {...props} value={client}/>,
        initialProps: {
          ...options,
          sort: (array) => {
            array = [...array]
            // Sort alphabetically
            array.sort((a, b) => a.name > b.name ? 1 : -1)
            return array
          }
        }
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'one',
            __typename: 'Item'
          }
        ])
      })
      const [addRes, executeAdd] = result.current[1]
      const [removeRes, executeRemove] = result.current[2]

      expect(addRes).toBeDefined()
      expect(removeRes).toBeDefined()

      executeAdd({
        id: 'one',
        name: 'bowl'
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'one',
            name: 'bowl',
            __typename: 'Item'
          }
        ])
      })

      executeRemove({
        id: 'one'
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([])
      })

      executeAdd({
        id: 'one',
        name: 'bowl'
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'one',
            name: 'bowl',
            __typename: 'Item'
          }
        ])
      })

      executeAdd({
        id: 'two',
        name: 'bowl'
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'one',
            name: 'bowl',
            __typename: 'Item'
          },
          {
            id: 'two',
            name: 'bowl',
            __typename: 'Item'
          }
        ])
      })

      executeAdd({
        name: 'clock'
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'one',
            name: 'bowl',
            __typename: 'Item'
          },
          {
            id: 'two',
            name: 'bowl',
            __typename: 'Item'
          },
          {
            id: 'id_0',
            name: 'clock',
            __typename: 'Item'
          }
        ])
      })

      executeAdd({
        id: 'two',
        name: 'abacus'
      })
      await wait(() => {
        const array = result.current[0]
        expect(array).toEqual([
          {
            id: 'two',
            name: 'abacus',
            __typename: 'Item'
          },
          {
            id: 'one',
            name: 'bowl',
            __typename: 'Item'
          },
          {
            id: 'id_0',
            name: 'clock',
            __typename: 'Item'
          }
        ])
      })
    })
  })
})
