import gql from 'graphql-tag'

export const NewConnection = gql`
  input NewConnection {
    name: String!
    description: String
    type: String
    endpoint: String
  }
`
