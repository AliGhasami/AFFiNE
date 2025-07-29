import type { MahdaadObjectProps } from '@blocksuite/affine-model';
import type { BlockModel } from '@blocksuite/store';
import { toast } from '@blocksuite/affine-components/toast';
import { humanFileSize } from '@blocksuite/affine-shared/utils';
import { nanoid } from 'nanoid';
import { EditorHost } from '@blocksuite/std';

export function addSiblingObjectBlock(
  editorHost: EditorHost,
  files: File[],
  maxFileSize: number,
  targetModel: BlockModel,
  place: 'after' | 'before' = 'after'
) {
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  if (!imageFiles.length) {
    return;
  }

  const isSizeExceeded = imageFiles.some(file => file.size > maxFileSize);
  if (isSizeExceeded) {
    toast(
      editorHost,
      `You can only upload files less than ${humanFileSize(
        maxFileSize,
        true,
        0
      )}`
    );
    return;
  }

  if (!window.$mahdaadEditor.files) {
    window.$mahdaadEditor.files = [];
  }

  const objectBlockProps: Partial<MahdaadObjectProps> &
    {
      flavour: 'affine:mahdaad-object';
    }[] = imageFiles.map(file => {
    const id = nanoid();
    window.$mahdaadEditor.files.push({ id, file });
    return {
      flavour: 'affine:mahdaad-object',
      file_id: id,
      object_id: undefined,
      link_id: undefined,
      type: 'image',
      show_type: 'embed',
      meta: {},
      //size: file.size,
    };
  });
  const doc = editorHost.doc;
  const blockIds = doc.addSiblingBlocks(targetModel, objectBlockProps, place);

  return blockIds;
}
