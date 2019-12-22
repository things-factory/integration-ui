import { pubsub } from '@things-factory/shell'
import { withFilter } from 'apollo-server-koa'

export const scenarioState = {
  scenarioState: {
    /* subscription payload can be filtered here */
    // resolve(payload, args) {
    //   return payload.systemRebooted
    // },
    // subscribe(_, args, { ctx }) {
    /* it is possible to check authentication here */
    // if (!ctx.user) {
    //   return null
    // }
    // return pubsub.asyncIterator('scenario-state')
    // }
    subscribe: withFilter(
      () => pubsub.asyncIterator('scenario-state'),
      (payload, variables) => {
        return !variables.name || payload.scenarioState.name === variables.name
      }
    )
  }
}
