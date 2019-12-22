import { MqttConnector } from './mqtt-connector'
import { IClientPublishOptions } from 'mqtt'

export type SendMqttMessageIn = {
  topic: string
  message: string
  options?: Object
}

export function sendMqttMessage({ topic, message, options }: SendMqttMessageIn) {
  var client = MqttConnector.client

  client.publish(topic, message, {
    retain: true,
    ...options
  } as IClientPublishOptions)
}
