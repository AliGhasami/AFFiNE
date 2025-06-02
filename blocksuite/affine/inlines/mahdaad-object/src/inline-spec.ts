import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { StdIdentifier } from '@blocksuite/std';
import { InlineSpecExtension } from '@blocksuite/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const MahdaadObjectInlineSpecExtension =
  InlineSpecExtension<AffineTextAttributes>('mahdaadObjectLink', provider => {
    const std = provider.get(StdIdentifier);
    return {
      name: 'mahdaadObjectLink',
      schema: z
        .object({
          //name: z.string(),
          //user_id: z.string(),
          //id: z.string(),
          object_id: z.string(),
          link_id: z.union([z.string(), z.number(), z.undefined(),z.null()]),
          //link_id: z.string(),
          type: z.string(),
          meta: z.any().optional(),
        })
        .optional()
        .nullable()
        .catch(undefined),
      match: delta => {
        return !!delta.attributes?.mahdaadObjectLink;
        //console.log("this is delta",delta)
        //if (delta.insert == '@') return false;
        //console.log("111111",!!delta.attributes?.mention)
        //return !!delta.attributes?.mention;
        //return !!delta.attributes?.mention?.member;
      },
      //todo ali ghasami for migrate style on define of component
      renderer: ({ delta, selected }) => {
        return html`<mahdaad-object-link-inline
          style="display: inline-block"
          .delta=${delta}
          .std=${std}
          .selected=${selected}
        ></mahdaad-object-link-inline>`;
      },
      embed: true,
    };
  });
