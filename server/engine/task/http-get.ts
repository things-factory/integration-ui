import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { GET_AUTH_HEADERS } from './http-auth'
import fetch from 'node-fetch'
import { URL } from 'url'

async function HttpGet(step, { logger }) {
  var { connection: connectionName, params: stepOptions } = step
  var { headers, params = {}, path } = stepOptions || {}
  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  var { endpoint, params: connectionParams } = connection

  var url = new URL(path, endpoint)
  // Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

  var response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(GET_AUTH_HEADERS(connectionParams) || {})
      // ...headers
    }
  })

  // TODO follow the format
  // plain-text
  var data = await response.json()
  // var data = await response.text()

  logger.info(`http-get : \n${JSON.stringify(data, null, 2)}`)
}

HttpGet.parameterSpec = [
  {
    type: 'string',
    name: 'path',
    label: 'path'
  },
  {
    type: 'string',
    name: 'headers',
    label: 'headers'
  },
  {
    type: 'string',
    name: 'params',
    label: 'params'
  }
]

TaskRegistry.registerTaskHandler('http-get', HttpGet)
