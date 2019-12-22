import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const updateScenario = {
  async updateScenario(_: any, { name, patch }, context: any) {
    const repository = getRepository(Scenario)
    const scenario = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...scenario,
      ...patch,
      updater: context.state.user
    })
  }
}