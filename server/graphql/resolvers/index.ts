import * as Connection from './connection'
import * as Scenario from './scenario'
import * as Step from './step'
import * as Connector from './connector'
import * as TaskType from './task-type'
import * as Publiser from './publisher'

export const queries = [Connection.Query, Scenario.Query, Step.Query, Connector.Query, TaskType.Query, Publiser.Query]

export const mutations = [Connection.Mutation, Scenario.Mutation, Step.Mutation, Publiser.Mutation]

export const subscriptions = [Scenario.Subscription]
