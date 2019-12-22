import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function EchoSend(step, { logger }) {
  var {
    connection: connectionName,
    params: { message }
  } = step

  var connection = Connections.getConnection(connectionName)
  if (!connection) {
    throw Error(`connection is not found : ${connectionName}`)
  }

  await connection.write(message)

  logger.info(`echo-send : '${message}'`)
}

TaskRegistry.registerTaskHandler('echo-send', EchoSend)
