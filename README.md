# urql-array-mutations-hook

> Mutate arrays in response to urql operations

React hook for combining the results from [useQuery](https://formidable.com/open-source/urql/docs/api/#usequery-hook) and [useMutation](https://formidable.com/open-source/urql/docs/api/#usemutation-hook). Meant for this scenario:

- You fetch an array of objects from a graphql server
- You send requests to modify that array on the server
- You want to sync the local array without re-requesting the whole darn thing

## Example

```js
import { useArrayMutations } from 'urql-array-mutations-hook'
import List from './ListComponent'

function ListWithGraphql ({ options }) {
  const [array, add, remove] = useArrayMutations(options)
  // These functions mutate the array,
  // which triggers a render cycle
  const addItem = add[1]
  const removeItem = remove[1]
  return (
    <List
      items={array}
      addItem={addItem}
      removeItem={removeItem}
    />
  )
}
```

## Options

The input for `useArrayMutations` is an object with these properties:

- **key**

  - `String | Function`

  - Each array element must be an object with a unique key value. By default, it uses the `id` property from each object, but the `key` option makes this customizable. When using a function, it takes one item as input, and must return the key value for that item.

- **get**

  - `String | Object`

  - Input for [useQuery](https://formidable.com/open-source/urql/docs/api/#usequery-hook); a string can be used as shorthand for the `query` property

- **add**

  - `String`

  - Input for [useMutation](https://formidable.com/open-source/urql/docs/api/#usemutation-hook); the operation result must include a key for the added item

- **remove**

  - `String`

  - Input for [useMutation](https://formidable.com/open-source/urql/docs/api/#usemutation-hook); the operation result must include a key for the removed item

- **sort**

  - `Function`

  - Invoked whenever the array is modified. It takes a single parameter (the array), and must return a sorted version.

Check [here](https://github.com/raingerber/urql-array-mutations-hook/blob/master/server/graphql-types.js#L15) for examples of get, add, and remove.

## Return Value

The return value is an array of arrays:

```js
const [array, add, remove, query] = useArrayMutations(options)
```

- **[0]** - the current array, made by combining any graphql responses

- **[1]** - return value from `useMutation(...options.add)`

- **[2]** - return value from `useMutation(...options.remove)`

- **[3]** - return value from `useQuery(...options.query)`
