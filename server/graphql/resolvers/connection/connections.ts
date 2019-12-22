import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

import { Connections } from '../../../engine'

export const connectionsResolver = {
  async connections(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(Connection).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater'],
    })

    items.forEach(conn => {
      conn.status = Connections.getConnection(conn.name) ? 1 : 0
    })

    return { items, total }
  }
}
