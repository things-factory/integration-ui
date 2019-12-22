import { getRepository, In } from 'typeorm'
import { Connection } from '../../../entities'

export const deleteConnections = {
  async deleteConnections(_: any, { names }, context: any) {
    await getRepository(Connection).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}

