import { Connection } from '../entities'

export interface PropertySpec {
  type: string
  label: string
  name: string
  placeholder?: string
  property?: any
}

export interface Connector {
  ready(connections: Connection[]): Promise<any>
  connect(connection: Connection): Promise<any>
  disconnect(name: string): Promise<any>
  parameterSpec: PropertySpec[]
}

export interface Step {
  sequence?: string
  type: string /* task */
  connection?: string /* TODO should be a connection name of params */
  name?: string /* TODO should be one of params for task */
  [propName: string]: any
}

export type TaskHandler = (step: Step, context: any) => void
