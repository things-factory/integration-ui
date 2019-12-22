import { getRepository } from 'typeorm'
import { Step } from '../../../entities'

export const updateStep = {
  async updateStep(_: any, { name, patch }, context: any) {
    const repository = getRepository(Step)
    const step = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...step,
      ...patch,
      updater: context.state.user
    })
  }
}