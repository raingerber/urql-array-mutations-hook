require('@babel/register')

const {createApp} = require('./graphql-app')

const port = process.env.PORT || 4000

createApp({
  port,
  initialValue: [],
  graphiql: true
})

console.log(`Running server on http://localhost:${port}`)
