import { SurfaceBlockModel } from '@blocksuite/affine-block-surface';
import { FileDropConfigExtension } from '@blocksuite/affine-components/drop-indicator';
import { MahdaadObjectBlockSchema } from '@blocksuite/affine-model';
import { matchModels } from '@blocksuite/affine-shared/utils';
import { addSiblingObjectBlock } from './utils';
import {
  checkFileFormat,
  checkFileSize,
} from '../../../../../../src/utils/fileUploadUtils';

export const ImageDropOption = FileDropConfigExtension({
  flavour: MahdaadObjectBlockSchema.model.flavour,
  onDrop: async ({ files, targetModel, std }) => {
    const maxFileSize = import.meta.env.VITE_IMAGE_MAX_UPLOAD_SIZE; // 10MB (default)
    /*const imageFiles = files.filter(async file => {
      const res = await checkFileFormat(file, 'image');
      return (
        res && checkFileSize(file, import.meta.env.VITE_IMAGE_MAX_UPLOAD_SIZE)
      ); //['image/jpeg', 'image/png'].includes(file.type);
    });
    if (!imageFiles.length) return false;*/
    const imageFiles = [];
    for (const file of files) {
      const formatOk = await checkFileFormat(file, 'image');
      const sizeOk = checkFileSize(
        file,
        import.meta.env.VITE_IMAGE_MAX_UPLOAD_SIZE
      );

      if (formatOk && sizeOk) {
        imageFiles.push(file);
      }
    }

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
