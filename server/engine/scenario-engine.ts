import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { pubsub } from '@things-factory/shell'
import { logger } from '@things-factory/env'

import { TaskRegistry } from './task-registry'
import { Step } from './types'

import { getRepository } from 'typeorm'
import { Scenario } from '../entities'
import { Connections } from './connections'

const scenarios = {}

const { combine, timestamp, splat, printf } = format

enum STATE {
  READY,
  STARTED,
  PAUSED,
  STOPPED,
  HALTED
}

const status = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED']

export class ScenarioEngine {
  private name: string
  private steps: Step[]
  private rounds: number = 0
  private _state: STATE
  private message: String
  private lastStep: number = -1
  private logger: any

  private static logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })

  public static getScenario(name) {
    return scenarios[name]
  }

  public static async load(scenarioConfig) {
    if (scenarios[scenarioConfig.name]) {
      return
    }
    var scenario = new ScenarioEngine(scenarioConfig.name, scenarioConfig.steps)
    scenario.start()

    scenarios[scenarioConfig.name] = scenario
  }

  public static async unload(name) {
    var scenario = scenarios[name]
    if (!scenario) {
      return
    }
    scenario.stop()

    delete scenarios[name]
  }

  public static async loadAll() {
    const SCENARIOS = await getRepository(Scenario).find({
      where: { active: true },
      relations: ['domain', 'creator', 'updater', 'steps']
    })

    SCENARIOS.forEach(scenario => ScenarioEngine.load(scenario))
  }

  constructor(name: string, steps: Step[]) {
    this.name = name
    this.steps = steps || []
    this.logger = createLogger({
      format: combine(timestamp(), splat(), ScenarioEngine.logFormat),
      transports: [
        new (transports as any).DailyRotateFile({
          filename: `logs/scenario-${name}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info'
        })
      ]
    })

    this.state = STATE.READY
  }

  async run() {
    if (this.state == STATE.STARTED || this.steps.length == 0) {
      return
    }

    this.state = STATE.STARTED
    var context = {
      logger: this.logger,
      publish: this.publish.bind(this)
    }

    try {
      while (this.state == STATE.STARTED) {
        this.lastStep = (this.lastStep + 1) % this.steps.length

        if (this.lastStep == 0) {
          this.rounds++
          this.logger.info(`Start ${this.rounds} Rounds  #######`)
        }

        var step = this.steps[this.lastStep]
        await this.process(step, context)

        this.publish()
      }
    } catch (ex) {
      this.message = ex.stack ? ex.stack : ex
      this.state = STATE.HALTED
    }
  }

  publish(message?) {
    var steps = this.steps.length
    var step = this.lastStep + 1

    pubsub.publish('scenario-state', {
      scenarioState: {
        name: this.name,
        state: status[this.state],
        progress: {
          rounds: this.rounds,
          rate: Math.round(100 * (step / steps)),
          steps,
          step
        },
        message
      }
    })
  }

  get state() {
    return this._state
  }

  set state(state) {
    if (this._state == state) {
      return
    }

    var message = `[state changed] ${status[this.state]} => ${status[state]}${
      this.message ? ' caused by ' + this.message : ''
    }`

    this.message = ''

    this.logger.info(message)
    this._state = state

    this.publish(message)
  }

  start() {
    this.run()
  }

  resume() {
    this.run()
  }

  stop() {
    this.state = STATE.STOPPED
  }

  despose() {
    this.stop()
  }

  async process(step, context) {
    step = {
      ...step
    } // copy step

    try {
      step.params = JSON.parse(step.params)
    } catch (ex) {
      this.logger.error('params parsing error. params must be a JSON.')
    }

    this.logger.info(`Step started. ${JSON.stringify(step)}`)

    var handler = TaskRegistry.getTaskHandler(step.task)
    if (!handler) {
      throw new Error(`no task handler for ${JSON.stringify(step)}`)
    } else {
      await handler(step, context)
    }

    this.logger.info(`Step done.`)
  }
}
