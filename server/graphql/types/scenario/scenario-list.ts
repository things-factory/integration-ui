import gql from 'graphql-tag'

export const ScenarioList = gql`
  type ScenarioList {
    items: [Scenario]
    total: Int
  }
`
