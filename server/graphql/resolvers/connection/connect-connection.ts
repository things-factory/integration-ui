import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

export const connectConnection = {
  async connectConnection(_: any, { name }, context: any) {
    var repository = getRepository(Connection)
    var connection = await repository.findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })

    await connection.connect()
    await repository.save(connection)

    return connection
  }
}
