import gql from 'graphql-tag'

export const NewScenario = gql`
  input NewScenario {
    name: String!
    description: String
    active: Boolean
  }
`
