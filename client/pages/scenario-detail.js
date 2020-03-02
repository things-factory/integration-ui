import { MultiColumnFormStyles } from '@things-factory/form-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { client } from '@things-factory/shell'
import { isMobileDevice } from '@things-factory/utils'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'

class ScenarioDetail extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      scenario: Object,
      gristConfig: Object
    }
  }

  static get styles() {
    return [
      MultiColumnFormStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          background-color: #fff;
        }

        data-grist {
          flex: 1;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }

        form {
          position: relative;
        }
      `
    ]
  }

  get dataGrist() {
    return this.renderRoot.querySelector('data-grist')
  }

  render() {
    return html`
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.gristConfig}
        .fetchHandler=${this.fetchHandler.bind(this)}
      ></data-grist>
      <div class="button-container">
        <mwc-button @click=${this._deleteSteps.bind(this)}>${i18next.t('button.delete')}</mwc-button>
        <mwc-button @click=${this._updateSteps.bind(this)}>${i18next.t('button.save')}</mwc-button>
      </div>
    `
  }

  async updated(changedProps) {
    if (changedProps.has('steps')) {
      console.log(this.steps)
    }
  }

  async firstUpdated() {
    this.select = [
      "name",
      "description",
      "sequence",
      "task",
      "connection",
      "params",
      "skip"
    ]
    this.gristConfig = {
      list: { fields: ['name', 'description', 'task'] },
      columns: [
        { type: 'gutter', gutterName: 'row-selector', multiple: true },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'add',
          handlers: {
            click: (...args) => this._copyRecord(...args)
          }
        },
        { type: 'gutter', gutterName: 'sequence' },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'arrow_upward',
          handlers: {
            click: (...args) => this._moveRecord(-1, ...args)
          }
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'arrow_downward',
          handlers: {
            click: (...args) => this._moveRecord(1, ...args)
          }
        },
        {
          type: 'number',
          name: 'sequence',
          hidden: true
        },
        {
          type: 'string',
          name: 'id',
          hidden: true
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            editable: true
          },
          width: 140
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            editable: true
          },
          width: 180
        },
        {
          type: 'task-type',
          name: 'task',
          header: i18next.t('field.task'),
          record: {
            editable: true
          },
          width: 120
        },
        {
          type: 'boolean',
          name: 'skip',
          header: i18next.t('field.skip'),
          record: {
            editable: true
          },
          width: 80
        },
        {
          type: 'connection',
          name: 'connection',
          header: i18next.t('field.connection'),
          record: {
            editable: true
          },
          width: 160
        },
        {
          type: 'parameters',
          name: 'params',
          header: i18next.t('field.params'),
          record: {
            editable: true,
            options: async (value, column, record, row, field) => {
              var task = record.task

              if (!task) {
                return []
              }

              var taskType = await this.fetchTaskType(task)
              return taskType && taskType.parameterSpec
            }
          },
          width: 200
        }
      ],
      rows: {
        selectable: {
          multiple: true
        }
      },
      pagination: {
        infinite: true
      },
      sorters: [
        {
          name: 'sequence'
        }
      ]
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query {
          steps ( 
            filters: { 
              name: "scenario",
              value: "${this.scenario.id}",
              operator: "eq" 
            },
            sortings: { name: "sequence" }
          ) {
            items {
              id
              ${this.select.join('\n')}
            }
            total
          }
        }
      `
    })

    return {
      total: response.data.steps.total || 0,
      records: response.data.steps.items || []
    }
  }

  async fetchTaskType(name) {
    const response = await client.query({
      query: gql`
        query($name: String!) {
          taskType(name: $name) {
            name
            description
            parameterSpec {
              type
              name
              label
              placeholder
              property
            }
          }
        }
      `,
      variables: {
        name
      }
    })

    return response.data.taskType
  }

  async _updateSteps() {
    let patches = this.dataGrist._data.records
    if (patches && patches.length) {
      patches = patches.map(patch => {
        var patchField = {}
        const dirtyFields = patch.__dirtyfields__
        for (let key in dirtyFields) {
          patchField[key] = dirtyFields[key].after
        }

        return { ...patch.__origin__, ...patchField }
      })

      const response = await client.mutate({
        mutation: gql`
          mutation($scenarioId: String!, $patches: [StepPatch]!) {
            updateMultipleStep(scenarioId: $scenarioId, patches: $patches) {
              name
            }
          }
        `,
        variables: {
          scenarioId: this.scenario.id,
          patches
        }
      })

      if (!response.errors) this.dataGrist.fetch()
    }
  }

  async _deleteSteps() {
    if (!confirm(i18next.t('text.sure_to_x', { x: i18next.t('text.delete') }))) return

    const ids = this.dataGrist.selected.map(record => record.id)
    if (!(ids && ids.length > 0)) return

    const response = await client.mutate({
      mutation: gql`
        mutation($ids: [String]!) {
          deleteSteps(ids: $ids)
        }
      `,
      variables: {
        ids
      }
    })

    if (response.errors) return

    this.dataGrist.fetch()
    await document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          message: i18next.t('text.info_x_successfully', {
            x: i18next.t('text.delete')
          })
        }
      })
    )
  }

  _moveRecord(steps, columns, data, column, record, rowIndex) {
    var moveTo = rowIndex + steps, length = data.records.length
    if (rowIndex >= length || moveTo < 0 || moveTo >= length) return
    var grist = this.dataGrist
    grist._data.records.splice(rowIndex, 1)
    grist._data.records.splice(moveTo, 0, record)
    grist.dispatchEvent(
      new CustomEvent('record-change', {
        bubbles: true,
        composed: true
      })
    )
    grist.grist.dispatchEvent(
      new CustomEvent('focus-change', {
        bubbles: true,
        composed: true,
        detail: {
          row: rowIndex + steps,
          column: column
        }
      })
    )
  }

  _copyRecord(columns, data, column, record, rowIndex) {
    if (rowIndex >= data.records.length) return
    var grist = this.dataGrist
    var copiedRecord = {};
    this.select.forEach(field => {
      copiedRecord[field] = record[field]
    })
    grist._data.records.splice(rowIndex + 1, 0, copiedRecord)
    grist.dispatchEvent(
      new CustomEvent('record-change', {
        bubbles: true,
        composed: true
      })
    )
  }
}

window.customElements.define('scenario-detail', ScenarioDetail)
