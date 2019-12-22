import { MqttConnector } from './controllers/mqtt-connector'
import { publishers } from './controllers/publishers'
import { startPublisher } from './controllers/start-publisher'
import { stopPublisher } from './controllers/stop-publisher'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  var paths = ['publishers', 'start-publisher', 'stop-publisher']

  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  routes.get('/publishers', async (context, next) => {
    context.body = {
      success: true,
      ...(await publishers())
    }
  })

  routes.get('/start-publisher/:id', async (context, next) => {
    var id = context.params.id
    context.body = {
      success: true,
      ...(await startPublisher(id, context))
    }
  })

  routes.get('/stop-publisher/:id', async (context, next) => {
    var id = context.params.id
    context.body = {
      success: true,
      ...(await stopPublisher(id, context))
    }
  })

  MqttConnector.initMqtt()
})
