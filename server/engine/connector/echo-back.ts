import net from 'net'
import PromiseSocket from 'promise-socket'

import { config, logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

export class EchoBack implements Connector {
  ready(connectionConfigs) {
    const ECHO_SERVER = config.get('echoServer')

    return new Promise((resolve, reject) => {
      var server = net.createServer(socket => {
        socket.on('data', function(data) {
          socket.write(data.toString())
        })
      })

      server.listen(ECHO_SERVER.port, async () => {
        logger.info('Echo-back server listening on %j', server.address())

        await Promise.all(connectionConfigs.map(this.connect))

        resolve()
      })
    })
  }

  async connect(connection) {
    let socket = new PromiseSocket(new net.Socket())
    let [host, port = 8124] = connection.endpoint.split(':')
    let { timeout = 30000 } = connection.params || {}

    socket.setTimeout(timeout)
    await socket.connect(port, host)
    Connections.addConnection(connection.name, socket)
  }

  async disconnect(name) {
    let socket = Connections.removeConnection(name)

    await socket.destroy()
  }

  get parameterSpec() {
    return [
      {
        type: 'number',
        label: 'timeout',
        placeholder: 'milli-seconds',
        name: 'timeout'
      }
    ]
  }
}

Connections.registerConnector('echo-back', new EchoBack())
