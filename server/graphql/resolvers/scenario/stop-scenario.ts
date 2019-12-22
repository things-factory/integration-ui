import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const stopScenario = {
  async stopScenario(_: any, { name }, context: any) {
    var repository = getRepository(Scenario)
    var scenario = await repository.findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    await scenario.stop()
    await repository.save(scenario)

    return scenario
  }
}
