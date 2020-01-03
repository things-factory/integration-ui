/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { html, css } from 'lit-element'
import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/board-ui/client/modeller-module'

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
}

customElements.define('property-editor-entity-selector', PropertyEditorEntitySelector)
