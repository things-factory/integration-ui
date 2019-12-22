import gql from 'graphql-tag'

export const ConnectorList = gql`
  type ConnectorList {
    items: [Connector]
    total: Int
  }
`
