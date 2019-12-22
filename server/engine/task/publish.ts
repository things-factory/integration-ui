import { TaskRegistry } from '../task-registry'

async function Publish(step, { logger, publish }) {
  var {
    params: { message }
  } = step

  publish(message)
}

TaskRegistry.registerTaskHandler('publish', Publish)
