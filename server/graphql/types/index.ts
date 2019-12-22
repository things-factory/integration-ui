import * as Connection from './connection'
import * as Scenario from './scenario'
import * as Step from './step'
import * as Connector from './connector'
import * as TaskType from './task-type'
import * as Publisher from './publisher'

import { PropertySpec } from './property-spec'

export const queries = [Publisher.Query, Connection.Query, Scenario.Query, Step.Query, Connector.Query, TaskType.Query]

export const mutations = [Publisher.Mutation, Connection.Mutation, Scenario.Mutation, Step.Mutation]

export const subscriptions = [Scenario.Subscription]

export const types = [
  PropertySpec,
  ...Publisher.Types,
  ...Connection.Types,
  ...Scenario.Types,
  ...Step.Types,
  ...Connector.Types,
  ...TaskType.Types
]
