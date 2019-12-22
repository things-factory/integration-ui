import { TaskRegistry } from '../../../engine/task-registry'

export const taskTypeResolver = {
  taskType(_: any, { name }, context: any) {
    var taskType = TaskRegistry.getTaskHandler(name)

    return {
      name,
      description: ''
    }
  }
}
