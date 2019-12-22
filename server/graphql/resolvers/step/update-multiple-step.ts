import { getRepository } from 'typeorm'
import { Step, Scenario } from '../../../entities'

export const updateMultipleStep = {
  async updateMultipleStep(_: any, { scenarioId, patches }, context: any) {
    let results = []
    const stepRepo = getRepository(Step)
    const scenario = await getRepository(Scenario).findOne(scenarioId)

    await stepRepo.delete({ domain: context.state.domain, scenario: scenarioId })

    for (let i = 0; i < patches.length; i++) {
      const result = await stepRepo.save({
        ...patches[i],
        sequence: i,
        scenario,
        domain: context.state.domain,
        creator: context.state.user,
        updater: context.state.user
      })

      results.push({ ...result, cuFlag: '+' })
    }

    return results
  }
}
