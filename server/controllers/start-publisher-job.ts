import { Publisher } from 'server/entities'
import { CronJob } from 'cron'
import fetch from 'node-fetch'
import { URL } from 'url'
import { sendMqttMessage } from './send-mqtt-message'
import { updatePublisher } from './update-publisher'
import { Context } from 'apollo-server-core'

export type StartPublisherJobIn = {
  publisher: Publisher
  autoStart?: Boolean
  baseURL?: string
  context?: Context
}

export function startPublisherJob({
  publisher,
  autoStart,
  baseURL = `http://localhost:${process.env.PORT}`,
  context
}: StartPublisherJobIn) {
  var globalObject = global as any
  if (!globalObject.jobs) globalObject.jobs = {}

  var { id, intervalExpr, apiUrl, timezone = 'Asia/Seoul', status } = publisher
  var url = new URL(apiUrl, baseURL)

  if (status == 1 && globalObject.jobs[id]) return publisher

  globalObject.jobs[id] = new CronJob(
    intervalExpr,
    async () => {
      var newStatus
      try {
        newStatus = 1
        var json = await fetch(url.toString()).then(async res => {
          return await res.json()
        })
        sendMqttMessage({
          topic: publisher.name,
          message: JSON.stringify(json)
        })
      } catch (e) {
        newStatus = 2
      } finally {
        if (newStatus != publisher.status) {
          publisher.status = newStatus
          updatePublisher({
            id,
            publisher,
            context
          })
        }
      }
    },
    () => {
      publisher.status = 0
      updatePublisher({
        id,
        publisher,
        context
      })
    },
    autoStart,
    timezone
  )
}
