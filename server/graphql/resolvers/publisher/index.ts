import { publisherResolver } from './publisher'
import { publishersResolver } from './publishers'

import { updatePublisher } from './update-publisher'
import { createPublisher } from './create-publisher'
import { deletePublisher, deletePublishers } from './delete-publisher'

export const Query = {
  ...publishersResolver,
  ...publisherResolver
}

export const Mutation = {
  ...updatePublisher,
  ...createPublisher,
  ...deletePublisher,
  ...deletePublishers
}
