import { taskTypeResolver } from './task-type'
import { taskTypesResolver } from './task-types'

export const Query = {
  ...taskTypesResolver,
  ...taskTypeResolver
}
