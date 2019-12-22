import { getRepository, In } from 'typeorm'
import { Scenario } from '../../../entities'

export const deleteScenarios = {
  async deleteScenarios(_: any, { ids }, context: any) {
    await getRepository(Scenario).delete({
      domain: context.state.domain,
      id: In(ids)
    })
    return true
  }
}
