import { style } from '@vanilla-extract/css';

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  width: '100%',
});

export const scrollArea = style({
  height: 0,
  flexGrow: 1,
});
