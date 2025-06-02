import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { StdIdentifier } from '@blocksuite/std';
import { InlineSpecExtension } from '@blocksuite/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const MahdaadMentionInlineSpecExtension =
  InlineSpecExtension<AffineTextAttributes>('mahdaadMention', provider => {
    const std = provider.get(StdIdentifier);
    return {
      name: 'mention',
      schema: z
        .object({
          user_id: z.string(),
          id: z.string(),
          //member: z.string(),
          //notification: z.string().optional(),
        })
        .optional()
        .nullable()
        .catch(undefined),
      match: delta => {
        //console.log("this is delta",delta)
        if (delta.insert == '@') return false;
        //console.log("111111",!!delta.attributes?.mention)
        return !!delta.attributes?.mention;
        //return !!delta.attributes?.mention?.member;
      },
      //todo ali ghasami for migrate style on define of component
      renderer: ({ delta, selected }) => {
        return html`<mahdaad-mention
          style="display: inline-block"
          .delta=${delta}
          .std=${std}
          .selected=${selected}
        ></mahdaad-mention>`;
      },
      embed: true,
    };
  });
