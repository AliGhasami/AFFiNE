import { MahdaadMultiColumnBlockSchema } from '@blocksuite/affine-model';

import type { DocMeta, TransformerMiddleware } from '@blocksuite/store';
import {
  checkParentIs,
  getParent,
} from '../../../../../../../src/claytapEditor/utils/is';
import {
  denyBlockWarningMessage,
  getBlockName,
} from '../../../../../../../src/claytapEditor/utils';

export const mahdaadMultiColumnMiddleware =
  (): TransformerMiddleware =>
  ({ slots, docCRUD }) => {
    slots.beforeImport.subscribe(payload => {
      if (payload && payload.type == 'slice') {
        const doc = docCRUD.get(payload.snapshot.pageId); //collection.getDoc(payload.snapshot.pageId);
        if (doc) {
          const block = doc.getBlock(payload?.parent);
          if (
            block &&
            (block.flavour == MahdaadMultiColumnBlockSchema.model.flavour ||
              checkParentIs(
                block.model,
                MahdaadMultiColumnBlockSchema.model.flavour
              ))
          ) {
            const includeColumn = payload.snapshot.content.find(item =>
              [MahdaadMultiColumnBlockSchema.model.flavour].includes(
                item.flavour
              )
            );
            payload.snapshot.content = payload.snapshot.content.filter(
              item =>
                ![MahdaadMultiColumnBlockSchema.model.flavour].includes(
                  item.flavour
                )
            );
            if (includeColumn) {
              const selectedBlock =
                block.flavour == MahdaadMultiColumnBlockSchema.model.flavour
                  ? block
                  : getParent(
                      block.model,
                      MahdaadMultiColumnBlockSchema.model.flavour
                    );
              const name = getBlockName(selectedBlock);
              denyBlockWarningMessage(name, name);
            }
          }
        }
      }
    });
  };
