/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { html, css } from 'lit-element'
import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/board-ui/client/modeller-module'
import { deepClone } from '@things-factory/shell'

import './things-editor-entity-selector'

export class PropertyEditorEntitySelector extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-entity-selector
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-entity-selector>
    `
  }

  shouldUpdate(changedProperties) {
    return true
  }

  get valueProperty() {
    return 'value'
  }

  _computeLabelId(label) {
    if (label.indexOf('label.') >= 0) return label

    return 'label.' + label
  }

  _valueChanged(e) {
    e.stopPropagation()

    this.value = deepClone(e.target[this.valueProperty])

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))

    if (!this.observe) return
    this.observe.call(this, this.value)
  }
}

customElements.define('property-editor-entity-selector', PropertyEditorEntitySelector)
