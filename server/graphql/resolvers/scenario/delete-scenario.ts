import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const deleteScenario = {
  async deleteScenario(_: any, { name }, context: any) {
    await getRepository(Scenario).delete({ domain: context.state.domain, name })
    return true
  }
}

