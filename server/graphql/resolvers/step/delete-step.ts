import { getRepository } from 'typeorm'
import { Step } from '../../../entities'

export const deleteStep = {
  async deleteStep(_: any, { name }, context: any) {
    await getRepository(Step).delete({ domain: context.state.domain, name })
    return true
  }
}

