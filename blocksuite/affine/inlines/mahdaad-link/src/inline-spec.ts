import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { StdIdentifier } from '@blocksuite/std';
import { InlineSpecExtension } from '@blocksuite/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const MahdaadLinkInlineSpecExtension =
  InlineSpecExtension<AffineTextAttributes>('mahdaadLink', provider => {
    const std = provider.get(StdIdentifier);
    return {
      name: 'link',
      schema: z.string().optional().nullable().catch(undefined),
      match: delta => {
        return !!delta.attributes?.link;
      },
      renderer: ({ delta, selected }) => {
        return html`<mahdaad-weblink-node
          .delta=${delta}
          .std=${std}
          .selected=${selected}
        ></mahdaad-weblink-node>`;
      },
      //embed: true,
    };
  });
