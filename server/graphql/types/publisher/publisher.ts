import gql from 'graphql-tag'

export const Publisher = gql`
  type Publisher {
    id: String
    domain: Domain
    name: String
    description: String
    intervalExpr: String
    apiUrl: String
    repeatCount: Int
    status: Int
    creator: User
    updater: User
    createdAt: String
    updatedAt: String
  }
`
