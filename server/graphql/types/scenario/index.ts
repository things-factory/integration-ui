import { Scenario } from './scenario'
import { NewScenario } from './new-scenario'
import { ScenarioPatch } from './scenario-patch'
import { ScenarioList } from './scenario-list'
import { ScenarioState } from './scenario-state'

export const Mutation = `
  createScenario (
    scenario: NewScenario!
  ): Scenario

  updateScenario (
    name: String!
    patch: ScenarioPatch!
  ): Scenario

  updateMultipleScenario (
    patches: [ScenarioPatch]!
  ): [Scenario]

  deleteScenario (
    name: String!
  ): Boolean

  deleteScenarios (
    ids: [String]!
  ): Boolean

  startScenario (
    name: String!
  ): Scenario

  stopScenario (
    name: String!
  ): Scenario
`

export const Query = `
  scenarios(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioList
  scenario(id: String!): Scenario
`

export const Subscription = `
  scenarioState(name: String): ScenarioState
`

export const Types = [Scenario, NewScenario, ScenarioPatch, ScenarioList, ScenarioState]
