import { CaptionedBlockComponent } from '@blocksuite/affine-components/caption';
import type { MahdaadObjectBlockModel } from '@blocksuite/affine-model';
import { html, type TemplateResult } from 'lit';

export class MahdaadCalloutBlockComponent extends CaptionedBlockComponent<MahdaadCalloutBlockModel> {

  override connectedCallback() {
    super.connectedCallback();
  }

  override renderBlock(): TemplateResult<1> {
    return html`this is callout block `;
  }

}
