import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function EchoReceive(step, { logger }) {
  var { connection: connectionName } = step

  var connection = Connections.getConnection(connectionName)

  var message = await connection.read()

  logger.info(`echo-receive : '${message.toString()}'`)
}

TaskRegistry.registerTaskHandler('echo-receive', EchoReceive)
