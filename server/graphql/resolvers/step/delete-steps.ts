import { getRepository, In } from 'typeorm'
import { Step } from '../../../entities'

export const deleteSteps = {
  async deleteSteps(_: any, { ids }, context: any) {
    await getRepository(Step).delete({ 
        domain: context.state.domain,
        id: In(ids)
    })
    return true
  }
}

