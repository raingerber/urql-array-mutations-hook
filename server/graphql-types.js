export const typeDefs = `
  type Item {
    id: String
    name: String
  }
  type Query {
    items: [Item]
  }
  type Mutation {
    add(id: String, name: String): Item
    remove(id: String!): Item
  }
`

export const options = {
  get: {
    query: `
      query Items {
        items {
          id
        }
      }
    `,
    requestPolicy: 'network-only'
  },
  add: `
    mutation AddItem($id: String, $name: String) {
      add(id: $id, name: $name) {
        id
        name
      }
    }
  `,
  remove: `
    mutation RemoveItem($id: String!) {
      remove(id: $id) {
        id
      }
    }
  `
}
