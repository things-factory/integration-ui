import { TaskRegistry } from '../task-registry'

async function Log(step, { logger }) {
  var {
    params: { message, level = 'info' }
  } = step

  switch (level) {
    case 'error':
      logger.error(message)
      return
    case 'warn':
      logger.warn(message)
      return
    default:
      logger.info(message)
  }
}

Log.parameterSpec = [
  {
    type: 'string',
    name: 'message',
    label: 'message'
  },
  {
    type: 'select',
    name: 'level',
    label: 'level',
    property: {
      options: ['info', 'warn', 'error']
    }
  }
]

TaskRegistry.registerTaskHandler('log', Log)
