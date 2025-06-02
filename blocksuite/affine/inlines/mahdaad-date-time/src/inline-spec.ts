import type { AffineTextAttributes } from '@blocksuite/affine-shared/types';
import { StdIdentifier } from '@blocksuite/std';
import { InlineSpecExtension } from '@blocksuite/std/inline';
import { html } from 'lit';
import { z } from 'zod';

export const MahdaadDateTimeInlineSpecExtension =
  InlineSpecExtension<AffineTextAttributes>('mahdaadDateTime', provider => {
    const std = provider.get(StdIdentifier);
    return {
      name: 'date',
      schema: z
        .object({
          time: z.string().nullable(),
          date: z.string(),
          id: z.string().optional(),
          meta: z.any().optional(),
        })
        .optional()
        .nullable()
        .catch(undefined),
      match: delta => {
        return !!delta.attributes?.date;
      },
      renderer: ({ delta, selected }) => {
        return html`<mahdaad-date-time-inline
          .delta=${delta}
          .std=${std}
          .selected=${selected}
        ></mahdaad-date-time-inline>`;
      },
      embed: true,
    };
  });
