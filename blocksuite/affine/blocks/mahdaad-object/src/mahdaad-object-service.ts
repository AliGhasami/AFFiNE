import { SurfaceBlockModel } from '@blocksuite/affine-block-surface';
import { FileDropConfigExtension } from '@blocksuite/affine-components/drop-indicator';
import { MahdaadObjectBlockSchema } from '@blocksuite/affine-model';
import { matchModels } from '@blocksuite/affine-shared/utils';
import { addSiblingObjectBlock } from './utils';

export const ImageDropOption = FileDropConfigExtension({
  flavour: MahdaadObjectBlockSchema.model.flavour,
  onDrop: ({ files, targetModel, std }) => {
    const maxFileSize = 10 * 1000 * 1000; // 10MB (default)
    const imageFiles = files.filter(file =>
      ['image/jpeg', 'image/png'].includes(file.type)
    );
    if (!imageFiles.length) return false;

    if (targetModel && !matchModels(targetModel, [SurfaceBlockModel])) {
      addSiblingObjectBlock(
        std.host,
        imageFiles,
        maxFileSize,
        targetModel
        //place
      );
      return true;
    }
    return false;
  },
});
