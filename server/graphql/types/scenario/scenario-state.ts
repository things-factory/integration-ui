import gql from 'graphql-tag'

export const ScenarioState = gql`
  type Progress {
    rounds: Int!
    rate: Int!
    steps: Int!
    step: Int!
  }

  enum ScenarioStatus {
    READY
    STARTED
    PAUSED
    STOPPED
    HALTED
  }

  type ScenarioState {
    name: String!
    state: ScenarioStatus!
    progress: Progress!
    message: String
  }
`
