import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const createScenario = {
  async createScenario(_: any, { scenario}, context: any) {
    return await getRepository(Scenario).save({
      ...scenario,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

