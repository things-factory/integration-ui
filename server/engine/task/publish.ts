import { TaskRegistry } from '../task-registry'

async function Publish(step, { logger, publish }) {
  var {
    params: { message }
  } = step

  publish(message)
}

Publish.parameterSpec = [
  {
    type: 'string',
    name: 'message',
    label: 'message'
  }
]

TaskRegistry.registerTaskHandler('publish', Publish)
