import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

import { Connections } from '../../../engine'

export const connectionResolver = {
  async connection(_: any, { name }, context: any) {
    var conn = await getRepository(Connection).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })

    if (conn) {
      conn.status = Connections.getConnection(name) ? 1 : 0
    }

    return conn
  }
}
