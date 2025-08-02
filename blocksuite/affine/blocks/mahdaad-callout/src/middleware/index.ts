import { MahdaadCalloutBlockSchema } from '@blocksuite/affine-model';
import {
  checkParentIs,
  getParent,
} from '../../../../../../../src/claytapEditor/utils/is';
import {
  denyBlockWarningMessage,
  getBlockName,
} from '../../../../../../../src/claytapEditor/utils';
import { Store } from '@blocksuite/store';

export const mahdaadCalloutMiddleware =
  () =>
  ({ slots, docCRUD }) => {
    slots.beforeImport.subscribe(payload => {
      if (payload && payload.type == 'slice') {
        const doc = docCRUD.get(payload.snapshot.pageId); //collection.getDoc(payload.snapshot.pageId);
        if (doc) {
          const block = doc.getBlock(payload?.parent);
          if (
            block &&
            (block.flavour == MahdaadCalloutBlockSchema.model.flavour ||
              checkParentIs(
                block.model,
                MahdaadCalloutBlockSchema.model.flavour
              ))
          ) {
            const allowList = MahdaadCalloutBlockSchema.model.children;
            const denyList = payload.snapshot.content.filter(
              item => !allowList.includes(item.flavour)
            );
            payload.snapshot.content = payload.snapshot.content.filter(item =>
              allowList.includes(item.flavour)
            );
            if (denyList.length > 0) {
              const selectedBlock =
                block.flavour == MahdaadCalloutBlockSchema.model.flavour
                  ? block
                  : getParent(
                      block.model,
                      MahdaadCalloutBlockSchema.model.flavour
                    );
              denyBlockWarningMessage(
                denyList.length > 1 ? null : getBlockName(denyList[0]),
                getBlockName(selectedBlock)
              );
            }
          }
        }
      }
    });
  };

export function calloutValidateChildren(
  doc: Store,
  payload: any,
  parent: string
) {
  debugger;
  const block = doc.getBlock(parent);
  if (
    block &&
    (block.flavour == MahdaadCalloutBlockSchema.model.flavour ||
      checkParentIs(block.model, MahdaadCalloutBlockSchema.model.flavour))
  ) {
    const allowList = MahdaadCalloutBlockSchema.model.children;
    const denyList = payload.content.filter(
      item => !allowList.includes(item.flavour)
    );
    payload.content = payload.content.filter(item =>
      allowList.includes(item.flavour)
    );
    if (denyList.length > 0) {
      const selectedBlock =
        block.flavour == MahdaadCalloutBlockSchema.model.flavour
          ? block
          : getParent(block.model, MahdaadCalloutBlockSchema.model.flavour);
      denyBlockWarningMessage(
        denyList.length > 1 ? null : getBlockName(denyList[0]),
        getBlockName(selectedBlock)
      );
    }
  }
}
