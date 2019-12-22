import { getRepository } from 'typeorm'
import { Publisher } from '../../../entities'

export const deletePublisher = {
  async deletePublisher(_, { id }, context) {
    const repository = getRepository(Publisher)

    return await repository.delete(id)
  }
}

export const deletePublishers = {
  async deletePublishers(_, { ids = [] }) {
    const repository = getRepository(Publisher)

    return await repository.delete(ids)
  }
}
