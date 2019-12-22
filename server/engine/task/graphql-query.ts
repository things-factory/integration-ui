import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import gql from 'graphql-tag'

async function GraphqlQuery(step, { logger }) {
  var { connection: connectionName, params: stepOptions } = step
  var { query } = stepOptions || {}

  var client = Connections.getConnection(connectionName)

  var response = await client.query({
    query: gql`
      ${query}
    `
  })

  var data = response.data

  logger.info(`graphql-query : \n${JSON.stringify(data, null, 2)}`)
}

GraphqlQuery.parameterSpec = [
  {
    type: 'graphql',
    name: 'query',
    label: 'query'
  }
]

TaskRegistry.registerTaskHandler('graphql-query', GraphqlQuery)
