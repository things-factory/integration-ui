import { stepResolver } from './step'
import { stepsResolver } from './steps'

import { updateStep } from './update-step'
import { updateMultipleStep } from './update-multiple-step'
import { createStep } from './create-step'
import { deleteStep } from './delete-step'
import { deleteSteps } from './delete-steps'

export const Query = {
  ...stepsResolver,
  ...stepResolver
}

export const Mutation = {
  ...updateStep,
  ...updateMultipleStep,
  ...createStep,
  ...deleteStep,
  ...deleteSteps
}
