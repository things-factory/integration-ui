import { path as appRootPath } from 'app-root-path'
import mqtt, { MqttClient } from 'mqtt'
import path from 'path'
import { publishersResolver } from '../graphql/resolvers/publisher/publishers'
import { startPublisherJob } from './start-publisher-job'

var mqttConfig
try {
  mqttConfig = require(path.resolve(appRootPath, 'mqttconfig'))
} catch (e) {
  mqttConfig = require('@things-factory/publisher-service/mqttconfig')
}

export class MqttConnector {
  static _client: MqttClient
  static get client(): MqttClient {
    return MqttConnector._client
  }

  static set client(client: MqttClient) {
    MqttConnector._client = client
  }

  static initMqtt() {
    if (!MqttConnector._client) {
      MqttConnector.connect()
    }
  }

  static connect() {
    var { brokerURL = 'mqtt://localhost' } = mqttConfig
    MqttConnector.client = mqtt.connect(brokerURL)

    MqttConnector.client.on('connect', async () => {
      // start all publishers that a status is 1.
      var publishers = await publishersResolver.publishers(
        null,
        {
          filters: [
            {
              name: 'status',
              operator: 'eq',
              value: 1
            }
          ]
        },
        null
      )

      publishers.items.forEach(p => {
        startPublisherJob({
          publisher: p,
          autoStart: true
        })
      })
    })
  }
}

// client.on('message', function(topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   client.end()
// })
