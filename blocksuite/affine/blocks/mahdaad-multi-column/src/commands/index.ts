import { BlockStdScope } from '@blocksuite/std';
import { BlockModel } from '@blocksuite/store';
import { MahdaadMultiColumnBlockSchema } from '@blocksuite/affine-model';

export function addColumnToMultiColumn(
  std: BlockStdScope,
  multiColumn: BlockModel
) {
  if (
    multiColumn.flavour == MahdaadMultiColumnBlockSchema.model.flavour &&
    multiColumn.children.length < 4
  ) {
    //std.host.doc.addBlock('affine:note', {}, multiColumn)
    std.host.doc.addBlock('affine:paragraph', {}, multiColumn);
    return multiColumn;
  }
  return null;
}

export function insertMultiColumn(
  std: BlockStdScope,
  targetModel: BlockModel,
  count: number = 0
) {
  const result = std.host.doc.addSiblingBlocks(
    targetModel,
    [{ flavour: 'affine:mahdaad-multi-column', count }],
    'after'
  );
  for (let i = 0; i < count; i++) {
    std.host.doc.addBlock('affine:paragraph', {}, result[0]);
    //const noteId = std.host.doc.addBlock('affine:note', {}, result[0]);
    //const paragraphId= std.doc.addBlock('affine:paragraph', {},noteId)
    /*if(i==0) {
      firstParagraphId= paragraphId
    }*/
  }
  return std.host.doc.getBlock(result[0]);
  /*if (targetModel.text?.length === 0) {
    std.doc.deleteBlock(targetModel);
  }*/
}
