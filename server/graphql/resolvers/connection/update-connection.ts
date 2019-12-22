import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

export const updateConnection = {
  async updateConnection(_: any, { name, patch }, context: any) {
    const repository = getRepository(Connection)
    const connection = await repository.findOne({ 
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...connection,
      ...patch,
      updater: context.state.user
    })
  }
}