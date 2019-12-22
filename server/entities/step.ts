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
import { Scenario } from './scenario'

@Entity()
@Index('ix_step_0', (step: Step) => [step.scenario, step.sequence], { unique: true })
export class Step {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column({
    nullable: true
  })
  name: string

  @Column({
    nullable: true
  })
  description: string

  @ManyToOne(
    type => Scenario,
    scenario => scenario.steps,
    { onDelete: 'CASCADE' }
  )
  scenario: Scenario

  @Column()
  sequence: Number

  @Column()
  task: string

  @Column({
    nullable: true
  })
  connection: string

  @Column({
    nullable: true
  })
  params: string

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
}
