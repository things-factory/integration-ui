import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'
import { ScenarioEngine } from '../../../engine'

export const scenarioResolver = {
  async scenario(_: any, { id }, context: any) {
    var sc = await getRepository(Scenario).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    if (sc) {
      sc.status = ScenarioEngine.getScenario(sc.name) ? 1 : 0
    }

    return sc
  }
}
