import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Step } from '../../../entities'

export const stepsResolver = {
  async steps(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Step).findAndCount({
      ...convertedParams,
      relations: ['domain', 'scenario', 'creator', 'updater']
    })
    return { items, total }
  }
}
