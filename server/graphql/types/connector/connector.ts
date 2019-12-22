import gql from 'graphql-tag'

export const Connector = gql`
  type Connector {
    name: String
    description: String
  }
`
