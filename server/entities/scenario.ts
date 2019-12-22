import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { Step } from './step'

import { ScenarioEngine } from '../engine'

@Entity()
@Index('ix_scenario_0', (scenario: Scenario) => [scenario.domain, scenario.name], { unique: true })
export class Scenario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column({
    nullable: true
  })
  active: boolean

  @Column({
    nullable: true
  })
  status: number

  @OneToMany(
    type => Step,
    step => step.scenario
  )
  steps: Step[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User

  async start() {
    try {
      await ScenarioEngine.load(this)
      this.status = 1
    } catch (ex) {
      this.status = 0
    }
  }

  async stop() {
    try {
      await ScenarioEngine.unload(this.name)
    } finally {
      this.status = 0
    }
  }
}
