import express from 'express'
import expressGraphql from 'express-graphql'
import {buildSchema} from 'graphql'
import {getProp, addItem, removeItem} from '../src/utils'
import {typeDefs} from './graphql-types'

const ITEM_KEY = 'id'

let c = 0
const uid = () => c++

const getKeyById = getProp(ITEM_KEY)

function createApp ({port, initialValue, graphiql}) {
  const app = express()
  const schema = buildSchema(typeDefs)
  // This variable will be modified
  // by the get/add/remove functions
  let items = initialValue || []
  const graphql = expressGraphql({
    schema,
    rootValue: {
      items: () => {
        return items
      },
      add: (item) => {
        if (!item[ITEM_KEY]) {
          item = {
            ...item,
            [ITEM_KEY]: `id_${uid()}`
          }
        }
        items = addItem(getKeyById, items, item)
        return item
      },
      remove: (item) => {
        items = removeItem(getKeyById, items, item)
        return item
      }
    },
    graphiql
  })
  app.use(graphql)
  return app.listen(port)
}

export {createApp}
