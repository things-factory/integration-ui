import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

export const deleteConnection = {
  async deleteConnection(_: any, { name }, context: any) {
    await getRepository(Connection).delete({ domain: context.state.domain, name })
    return true
  }
}

