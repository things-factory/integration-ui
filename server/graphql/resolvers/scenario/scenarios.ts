import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'
import { ScenarioEngine } from '../../../engine'

export const scenariosResolver = {
  async scenarios(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(Scenario).findAndCount({
      ...convertedParams,
      relations: ['domain', 'steps', 'creator', 'updater']
    })

    items.forEach(scenario => {
      scenario.status = ScenarioEngine.getScenario(scenario.name) ? 1 : 0
    })

    return { items, total }
  }
}
