import { Connections } from '../../../engine/connections'

export const connectorsResolver = {
  connectors(_: any, {}, context: any) {
    var connectors = Connections.getConnectors()
    var items = Object.keys(connectors).map(name => {
      return {
        name,
        description: ''
      }
    })

    return {
      items,
      total: items.length
    }
  }
}
