import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

export const createConnection = {
  async createConnection(_: any, { connection}, context: any) {
    return await getRepository(Connection).save({
      ...connection,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}

