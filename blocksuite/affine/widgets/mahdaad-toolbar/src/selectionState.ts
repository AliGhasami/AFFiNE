import { BlockSelection, TextSelection } from '@blocksuite/std';

type SelectionState = {
  hasTextSelection: boolean;
  hasBlockSelection: boolean;
};

/**
 * Computes whether there is a text selection or block selection, similar to toolbar.ts logic,
 * without depending on the toolbar flags service.
 */
export function getSelectionState(std: any): SelectionState {
  const range: Range | null = std?.range?.value ?? null;

  const textSel = std?.selection?.find?.(TextSelection);
  const hasTextSelection = Boolean(
    range &&
      textSel &&
      !textSel.isCollapsed?.() &&
      ((textSel.from?.length ?? 0) + (textSel.to?.length ?? 0)) > 0
  );

  const blockSelections = std?.selection?.filter?.(BlockSelection) ?? [];
  const hasBlockSelection = Array.isArray(blockSelections)
    ? blockSelections.length > 0
    : false;

  return { hasTextSelection, hasBlockSelection };
}



