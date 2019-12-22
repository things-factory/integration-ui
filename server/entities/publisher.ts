import { User } from '@things-factory/auth-base'
import { Domain } from '@things-factory/shell'
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('publishers')
@Index('ix_publisher_0', (publisher: Publisher) => [publisher.domain, publisher.name], { unique: true })
@Index('ix_publisher_1', (publisher: Publisher) => [publisher.domain, publisher.status])
@Index('ix_publisher_2', (publisher: Publisher) => [publisher.domain, publisher.apiUrl])
export class Publisher {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain, {
    eager: true
  })
  domain: Domain

  @Column({
    unique: true
  })
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column({
    length: 80,
    nullable: true
  })
  intervalExpr: string

  @Column({
    nullable: true
  })
  apiUrl: string

  @Column({
    nullable: true
  })
  timezone: string

  @Column({
    type: 'int',
    nullable: true
  })
  repeatCount: number

  @Column({
    type: 'int2',
    nullable: true
  })
  status: number

  @ManyToOne(type => User, {
    nullable: true,
    eager: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true,
    eager: true
  })
  updater: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
