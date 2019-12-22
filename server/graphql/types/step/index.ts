import { Step } from './step'
import { NewStep } from './new-step'
import { StepPatch } from './step-patch'
import { StepList } from './step-list'

export const Mutation = `
  createStep (
    step: NewStep!
  ): Step

  updateStep (
    name: String!
    patch: StepPatch!
  ): Step

  updateMultipleStep (
    scenarioId: String
    patches: [StepPatch]!
  ): [Step]

  deleteStep (
    id: String!
  ): Boolean

  deleteSteps (
    ids: [String]!
  ): Boolean
`

export const Query = `
  steps(filters: [Filter], pagination: Pagination, sortings: [Sorting]): StepList
  step(name: String!): Step
`

export const Types = [Step, NewStep, StepPatch, StepList]
