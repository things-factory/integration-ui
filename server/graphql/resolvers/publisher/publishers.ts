import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Publisher } from '../../../entities'

export const publishersResolver = {
  async publishers(_: any, params: ListParam, context: any) {
    var publisherRepo = getRepository(Publisher)
    var findOptions = convertListParams(params)

    const [items, total] = await publisherRepo.findAndCount({
      ...findOptions
    })

    return { items, total }
  }
}
