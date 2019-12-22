import { logger } from '@things-factory/env'
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

TaskRegistry.registerTaskHandler('sleep', Sleep)
