import { TaskHandler } from './types'

export class TaskRegistry {
  static handlers: { [type: string]: TaskHandler } = {}

  static getTaskHandler(type: string): TaskHandler {
    return TaskRegistry.handlers[type]
  }

  static registerTaskHandler(type: string, handler: TaskHandler) {
    TaskRegistry.handlers[type] = handler
  }

  static unregisterTaskHandler(type: string) {
    delete TaskRegistry.handlers[type]
  }

  static getTaskHandlers(): { [propName: string]: TaskHandler } {
    return {
      ...TaskRegistry.handlers
    }
  }
}
