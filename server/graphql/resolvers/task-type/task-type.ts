import { TaskRegistry } from '../../../engine/task-registry'

export const taskTypeResolver = {
  taskType(_: any, { name }, context: any) {
    var taskType: any = TaskRegistry.getTaskHandler(name)

    return {
      name,
      description: '',
      parameterSpec: taskType.parameterSpec
    }
  }
}
