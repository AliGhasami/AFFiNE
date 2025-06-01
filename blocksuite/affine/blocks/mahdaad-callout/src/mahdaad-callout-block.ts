import { CaptionedBlockComponent } from '@blocksuite/affine-components/caption';
import type { MahdaadCalloutBlockModel } from '@blocksuite/affine-model';
import { transformModel } from '@blocksuite/affine-shared/utils'
import { BlockModel } from '@blocksuite/store'
import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import {pick} from 'lodash-es'

export class MahdaadCalloutBlockComponent extends CaptionedBlockComponent<MahdaadCalloutBlockModel> {

  @property({ attribute: false })
  accessor _isLoad: boolean = false;

  override connectedCallback() {
    super.connectedCallback();
  }

  //todo ali ghasami
  /*override previewName(): string {
    //this.model.
    return  getBlockName(this)
    //return  'Callout'
  }*/


  //todo ali ghasami for check empty important
  /*override async getUpdateComplete() {
    const result = await super.getUpdateComplete();
    checkNotEmptyNote(this.model,this.doc)
    return result;
  }*/

  changeProps(event:CustomEvent) {
    const data=event.detail[0]
    if(data) {
      const normal=pick(data,['type','icon','background'])
      this.doc.updateBlock(this.model,{
        ...normal
      })
    }
  }

  convertToType(blocksModel:BlockModel[],flavour:string,type:string) {
    blocksModel.forEach(blockModel=>{
      /*this.std.command
        .chain()
        .updateBlockType({
          flavour,
          props:{ type } ,
        })
        .run();*/
      //this.std.doc.updateBlock(blockModel,{flavour,type})
      if(blockModel.flavour==flavour) {
        this.doc.updateBlock(blockModel,{flavour,type})
      }else{
        transformModel(blockModel, flavour, {type});
      }
      this.convertToType(blockModel.children,flavour,type)
    })
  }


  changeOptions(event:CustomEvent) {
    const key=event.detail[0]
    switch (key) {
      case 'delete':
        this.doc.deleteBlock(this.model)
        break
      case 'text':
        this.convertToType(this.model.children,'affine:paragraph','text')
        break
      case 'heading_1':
        this.convertToType(this.model.children,'affine:paragraph','h1')
        break
      case 'heading_2':
        this.convertToType(this.model.children,'affine:paragraph','h2')
        break
      case 'heading_3':
        this.convertToType(this.model.children,'affine:paragraph','h3')
        break
      case 'bullet_list':
        this.convertToType(this.model.children,'affine:list', 'bulleted')
        break
      case 'number_list':
        this.convertToType(this.model.children,'affine:list', 'numbered')
        break
      case 'right_to_left':
        this.doc.updateBlock(this.model, { dir: 'rtl'})
        break
      case 'left_to_right':
        //todo ali ghasami for check
        delete this.model.props.dir
        this.doc.updateBlock(this.model, { })
        break
    }
  }


  override renderBlock(): TemplateResult<1> {
    return html`
      <div dir=${this.model.props.dir}>
        <mahdaad-callout-component
          type="${this.model.props.type}"
          background="${this.model.props.background}"
          icon="${this.model.props.icon}"
          @changeProps="${this.changeProps}"
          read-only="${this.doc.readonly}"
          @mount="${() => {
            this._isLoad = true;
          }}"
          @changeOption="${this.changeOptions}"
          direction="${this.model.props.dir}"
        >
          <div class="nest-editor">
            <div class="affine-note-block-container">
              <div class="affine-block-children-container">
                ${this._isLoad ? this.renderChildren(this.model) : ''}
              </div>
            </div>
          </div>
        </mahdaad-callout-component>
      </div>
    `;
  }

}
