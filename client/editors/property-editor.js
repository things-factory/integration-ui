/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { html, css } from 'lit-element'
import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/modeller-ui'

import './things-editor-http-headers'
import './things-editor-http-parameters'

export class PropertyEditorHttpHeader extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-http-header
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-http-header>
    `
  }
}

customElements.define('property-editor-http-header', PropertyEditorHttpHeader)

export class PropertyEditorHttpParameter extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-http-parameter
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-http-parameter>
    `
  }
}

customElements.define('property-editor-http-parameter', PropertyEditorHttpParameter)
