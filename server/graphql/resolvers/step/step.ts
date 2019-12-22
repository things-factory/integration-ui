import { getRepository } from 'typeorm'
import { Step } from '../../../entities'

export const stepResolver = {
  async step(_: any, { name }, context: any) {
    return await getRepository(Step).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'scenario', 'creator', 'updater']
    })
  }
}
