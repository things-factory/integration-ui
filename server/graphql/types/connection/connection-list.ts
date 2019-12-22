import gql from 'graphql-tag'

export const ConnectionList = gql`
  type ConnectionList {
    items: [Connection]
    total: Int
  }
`
