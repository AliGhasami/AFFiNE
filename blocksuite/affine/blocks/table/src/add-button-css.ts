import { cssVar, cssVarV2 } from '@blocksuite/affine-shared/theme';
import { css } from '@emotion/css';

export const addColumnButtonStyle = css({
  cursor: 'col-resize',
  backgroundColor: cssVarV2.layer.background.hoverOverlay,
  fontSize: '16px',
  color: cssVarV2.icon.secondary,
  display: 'flex',
  width: '16px',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '0',
  left: 'calc(100% + 2px)',
  height: '100%',
  transition:
    'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  borderRadius: '2px',
  opacity: 0,
  ':hover': {
    backgroundColor: cssVarV2.table.indicator.drag,
    color: cssVarV2.icon.primary,
    opacity: 1,
  },
  '&.active': {
    backgroundColor: cssVarV2.table.indicator.drag,
    color: cssVarV2.icon.primary,
    opacity: 1,
  },
});

export const addRowButtonStyle = css({
  cursor: 'row-resize',
  backgroundColor: cssVarV2.layer.background.hoverOverlay,
  fontSize: '16px',
  color: cssVarV2.icon.secondary,
  display: 'flex',
  height: '16px',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 'calc(100% + 2px)',
  left: '0',
  width: '100%',
  transition:
    'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  borderRadius: '2px',
  opacity: 0,
  ':hover': {
    backgroundColor: cssVarV2.table.indicator.drag,
    color: cssVarV2.icon.primary,
    opacity: 1,
  },
  '&.active': {
    backgroundColor: cssVarV2.table.indicator.drag,
    color: cssVarV2.icon.primary,
    opacity: 1,
  },
});

export const addRowColumnButtonStyle = css({
  cursor: 'nwse-resize',
  backgroundColor: cssVarV2.layer.background.hoverOverlay,
  fontSize: '16px',
  color: cssVarV2.icon.secondary,
  display: 'flex',
  width: '16px',
  height: '16px',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 'calc(100% + 2px)',
  left: 'calc(100% + 2px)',
  borderRadius: '2px',
  opacity: 0,
  transition:
    'opacity 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  ':hover': {
    backgroundColor: cssVarV2.table.indicator.drag,
    color: cssVarV2.icon.primary,
    opacity: 1,
  },
  '&.active': {
    backgroundColor: cssVarV2.table.indicator.drag,
    color: cssVarV2.icon.primary,
    opacity: 1,
  },
});

export const cellCountTipsStyle = css({
  position: 'absolute',
  backgroundColor: cssVarV2.tooltips.background,
  borderRadius: '4px',
  padding: '4px',
  boxShadow: cssVar('buttonShadow'),
  color: cssVarV2.tooltips.foreground,
  whiteSpace: 'nowrap',
});
