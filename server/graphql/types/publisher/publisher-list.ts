import gql from 'graphql-tag'

export const PublisherList = gql`
  type PublisherList {
    items: [Publisher]
    total: Int
  }
`
