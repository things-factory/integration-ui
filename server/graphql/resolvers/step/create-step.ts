import { getRepository } from 'typeorm'
import { Step } from '../../../entities'

export const createStep = {
  async createStep(_: any, { step }, context: any) {
    return await getRepository(Step).save({
      ...step,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}
