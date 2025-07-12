/** @alighasami for check merge **/

type CollisionBox = {
  /**
   * The point that the objRect is positioned to.
   */
  positioningPoint: { x: number; y: number };
  /**
   * The boundary rect of the obj that is being positioned.
   */
  objRect?: { height: number; width: number };
  /**
   * The boundary rect of the container that the obj is in.
   */
  boundaryRect?: DOMRect;
  offsetX?: number;
  offsetY?: number;
  edgeGap?: number;
};

export function calcSafeCoordinate({
  positioningPoint,
  objRect = { width: 0, height: 0 },
  boundaryRect = document.body.getBoundingClientRect(),
  offsetX = 0,
  offsetY = 0,
  edgeGap = 20,
  direction = 'ltr',
}: CollisionBox & { direction?: 'rtl' | 'ltr' }) {
  const width = objRect?.width ?? 0;

  let x = positioningPoint.x + offsetX;
  const y = positioningPoint.y + offsetY;

  // محاسبه محدودیت‌های افقی با توجه به RTL/LTR
  if (direction === 'rtl') {
    // در RTL، از سمت راست چک می‌کنیم
    if (x < boundaryRect.left) {
      x = boundaryRect.left;
    } else if (x + width > boundaryRect.right) {
      x = boundaryRect.right - width;
    }
  } else {
    // در LTR، از سمت چپ چک می‌کنیم
    if (x + width > boundaryRect.right) {
      x = boundaryRect.right - width;
    } else if (x < boundaryRect.left) {
      x = boundaryRect.left;
    }
  }

  // Not use clamp for y coordinate to avoid the quick bar always showing after scrolling
  // const safeY = clamp(
  //   positioningPoint.y + offsetY,
  //   edgeGap,
  //   boundaryRect.height - objRect.height - edgeGap
  // );
  return {
    x,
    y,
  };
}

/**
 * Used to compare the space available
 * at the top and bottom of an element within a container.
 *
 * Please give preference to {@link getPopperPosition}
 */
export function compareTopAndBottomSpace(
  obj: { getBoundingClientRect: () => DOMRect },
  container = document.body,
  gap = 20
) {
  const objRect = obj.getBoundingClientRect();
  const spaceRect = container.getBoundingClientRect();
  const topSpace = objRect.top - spaceRect.top;
  const bottomSpace = spaceRect.bottom - objRect.bottom;
  const topOrBottom: 'top' | 'bottom' =
    topSpace > bottomSpace ? 'top' : 'bottom';
  return {
    placement: topOrBottom,
    // the height is the available space.
    height: (topOrBottom === 'top' ? topSpace : bottomSpace) - gap,
  };
}

/**
 * Get the position of the popper element with flip.
 */
export function getPopperPosition(
  popper: {
    getBoundingClientRect: () => DOMRect;
  },
  reference: {
    getBoundingClientRect: () => DOMRect;
  },
  { gap = 12, offsetY = 5 }: { gap?: number; offsetY?: number } = {},
  direction: 'rtl' | 'ltr' = 'ltr'
) {
  if (!popper) {
    console.warn(
      'The popper element is not exist. Popper position maybe incorrect'
    );
  }

  const { placement, height } = compareTopAndBottomSpace(
    reference,
    document.body,
    gap + offsetY
  );

  const referenceRect = reference.getBoundingClientRect();
  const popperRect = popper?.getBoundingClientRect();

  // تغییر محاسبه نقطه موقعیت با توجه به RTL/LTR
  const positioningPoint = {
    // در حالت RTL، از سمت راست محاسبه می‌کنیم
    x:
      direction === 'rtl'
        ? referenceRect.right - (popperRect?.width ?? 0)
        : referenceRect.x,
    y: referenceRect.y + (placement === 'bottom' ? referenceRect.height : 0),
  };

  const boundaryRect = document.body.getBoundingClientRect();

  // اضافه کردن محدودیت‌های RTL به calcSafeCoordinate
  const safeCoordinate = calcSafeCoordinate({
    positioningPoint,
    objRect: popperRect,
    boundaryRect,
    offsetY: placement === 'bottom' ? offsetY : -offsetY,
    direction, // اضافه کردن direction به پارامترها
  });

  return {
    placement,
    /**
     * The height is the available space height.
     *
     * Note: it's a max height, not the real height,
     * because sometimes the popper's height is smaller than the available space.
     */
    height,
    x: `${safeCoordinate.x}px`,
    y:
      placement === 'bottom'
        ? `${safeCoordinate.y}px`
        : `calc(${safeCoordinate.y}px - 100%)`,
    // اضافه کردن direction به خروجی برای استفاده در کامپوننت
    direction,
  };
}
