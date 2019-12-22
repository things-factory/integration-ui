import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'

async function Sleep(step, { logger }) {
  var {
    params: { duration }
  } = step

  logger.info(`sleep ${duration}ms`)

  if (duration) {
    await sleep(duration)
  }
}

Sleep.parameterSpec = [
  {
    type: 'number',
    name: 'duration',
    placeholder: 'milli-seconds',
    label: 'duration'
  }
]

TaskRegistry.registerTaskHandler('sleep', Sleep)
