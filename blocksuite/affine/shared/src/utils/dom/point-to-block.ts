import { NoteBlockModel, RootBlockModel } from '@blocksuite/affine-model';
import { clamp, type Point, type Rect } from '@blocksuite/global/gfx';
import { BLOCK_ID_ATTR, type BlockComponent } from '@blocksuite/std';
import { SurfaceBlockModel } from '@blocksuite/std/gfx';
import type { BlockModel } from '@blocksuite/store';

import { BLOCK_CHILDREN_CONTAINER_PADDING_LEFT } from '../../consts/index.js';
import { matchModels } from '../model/checker.js';

const ATTR_SELECTOR = `[${BLOCK_ID_ATTR}]`;

// margin-top: calc(var(--affine-paragraph-space) + 24px);
// h1.margin-top = 8px + 24px = 32px;
const MAX_SPACE = 32;
const STEPS = MAX_SPACE / 2 / 2;

/**
 * Returns `16` if node is contained in the parent.
 * Otherwise return `0`.
 */
function contains(parent: Element, node: Element) {
  return (
    parent.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}

/**
 * Returns `true` if element has `data-block-id` attribute.
 */
function hasBlockId(element: Element): element is BlockComponent {
  return element.hasAttribute(BLOCK_ID_ATTR);
}

/**
 * Returns `true` if element is default/edgeless page or note.
 */
function isRootOrNoteOrSurface(element: BlockComponent) {
  return matchModels(element.model, [
    RootBlockModel,
    NoteBlockModel,
    SurfaceBlockModel,
  ]);
}

function isBlock(element: BlockComponent) {
  return !isRootOrNoteOrSurface(element);
}

function isImage({ tagName }: Element) {
  return tagName === 'AFFINE-IMAGE';
}

function isDatabase({ tagName }: Element) {
  return tagName === 'AFFINE-DATABASE-TABLE' || tagName === 'AFFINE-DATABASE';
}

/**
 * Returns the closest block element by a point in the rect.
 *
 * ```
 * ############### block
 * ||############# block
 * ||||########### block
 * ||||    ...
 * ||||  y - 2 * n
 * ||||    ...
 * ||||----------- cursor
 * ||||    ...
 * ||||  y + 2 * n
 * ||||    ...
 * ||||########### block
 * ||############# block
 * ############### block
 * ```
 */
export function getClosestBlockComponentByPoint(
  point: Point,
  state: {
    rect?: Rect;
    container?: Element;
    snapToEdge?: {
      x: boolean;
      y: boolean;
    };
  } | null = null,
  scale = 1
): BlockComponent | null {
  const { y } = point;

  let container;
  let element = null;
  let bounds = null;
  let childBounds = null;
  let diff = 0;
  let n = 1;

  if (state) {
    const {
      snapToEdge = {
        x: true,
        y: false,
      },
    } = state;
    container = state.container;
    const rect = state.rect || container?.getBoundingClientRect();
    if (rect) {
      if (snapToEdge.x) {
        point.x = Math.min(
          Math.max(point.x, rect.left) +
            BLOCK_CHILDREN_CONTAINER_PADDING_LEFT * scale -
            1,
          rect.right - BLOCK_CHILDREN_CONTAINER_PADDING_LEFT * scale - 1
        );
      }
      if (snapToEdge.y) {
        // TODO handle scale
        if (scale !== 1) {
          console.warn('scale is not supported yet');
        }
        point.y = clamp(point.y, rect.top + 1, rect.bottom - 1);
      }
    }
  }

  // find block element
  element = findBlockComponent(
    document.elementsFromPoint(point.x, point.y),
    container
  );

  // Horizontal direction: for nested structures
  if (element) {
    // Database
    if (isDatabase(element)) {
      bounds = element.getBoundingClientRect();
      const rows = getDatabaseBlockRowsElement(element);
      if (rows) {
        childBounds = rows.getBoundingClientRect();

        if (childBounds.height) {
          if (point.y < childBounds.top || point.y > childBounds.bottom) {
            return element as BlockComponent;
          }
          childBounds = null;
        } else {
          return element as BlockComponent;
        }
      }
    } else {
      bounds = getRectByBlockComponent(element);
      // Indented paragraphs or list
      childBounds = element
        .querySelector('.affine-block-children-container')
        ?.firstElementChild?.getBoundingClientRect();

      if (childBounds && childBounds.height) {
        if (bounds.x < point.x && point.x <= childBounds.x) {
          return element as BlockComponent;
        }
        childBounds = null;
      } else {
        return element as BlockComponent;
      }
    }

    bounds = null;
    element = null;
  }

  // Vertical direction
  do {
    point.y = y - n * 2;

    if (n < 0) n--;
    n *= -1;

    // find block element
    element = findBlockComponent(
      document.elementsFromPoint(point.x, point.y),
      container
    );

    if (element) {
      bounds = getRectByBlockComponent(element);
      diff = bounds.bottom - point.y;
      if (diff >= 0 && diff <= STEPS * 2) {
        return element as BlockComponent;
      }
      diff = point.y - bounds.top;
      if (diff >= 0 && diff <= STEPS * 2) {
        return element as BlockComponent;
      }
      bounds = null;
      element = null;
    }
  } while (n <= STEPS);

  return element;
}

/**
 * Find the most close block on the given position
 * @param container container which the blocks can be found inside
 * @param point position
 * @param selector selector to find the block
 */
/** old method affine */
/*export function findClosestBlockComponent(
  container: BlockComponent,
  point: Point,
  selector: string
): BlockComponent | null {
  const children = (
    Array.from(container.querySelectorAll(selector)) as BlockComponent[]
  )
    .filter(child => child.host === container.host)
    .filter(child => child !== container);

  let lastDistance = Number.POSITIVE_INFINITY;
  let lastChild = null;

  if (!children.length) return null;

  for (const child of children) {
    const rect = child.getBoundingClientRect();
    if (rect.height === 0 || point.y > rect.bottom || point.y < rect.top)
      continue;
    const distance =
      Math.pow(point.y - (rect.y + rect.height / 2), 2) +
      Math.pow(point.x - rect.x, 2);

    if (distance <= lastDistance) {
      lastDistance = distance;
      lastChild = child;
    } else {
      return lastChild;
    }
  }

  return lastChild;
}*/

export function findClosestBlockComponent(
  container: BlockComponent,
  point: Point,
  selector: string,
  isRTL: boolean = false
): BlockComponent | null {
  const children = (
    Array.from(container.querySelectorAll(selector)) as BlockComponent[]
  )
    .filter(child => child.host === container.host)
    .filter(child => child !== container);

  if (!children.length) return null;

  //console.log(children);

  // اول فیلتر کردن بر اساس محدوده Y
  const validChildren = children.filter(child => {
    const rect = child.getBoundingClientRect();
    return rect.height !== 0 && point.y <= rect.bottom && point.y >= rect.top;
  });

  if (!validChildren.length) return null;

  // جهت نوشتار برای تعیین لبه شروع (start edge)
  //const isRTL = true; //getComputedStyle(container).direction === 'rtl';
  const distToStart = (rect: DOMRect) =>
    Math.abs(point.x - (isRTL ? rect.right : rect.left));

  // 1) اگر نقطه به صورت افقی داخل رکت هر کدام باشد، همان‌ها را اولویت بده
  const horizontallyContaining = validChildren.filter(child => {
    const rect = child.getBoundingClientRect();
    return point.x >= rect.left && point.x <= rect.right;
  });

  if (horizontallyContaining.length) {
    // اگر چند مورد بود، نزدیک‌ترین به مرکز افقی انتخاب می‌شود
    return horizontallyContaining.reduce((closest, current) => {
      const currentRect = current.getBoundingClientRect();
      const closestRect = closest.getBoundingClientRect();

      // ابتدا نزدیک‌ترین به لبه شروع را ترجیح بده (برای رفع مشکل نزدیک شروع بلاک در RTL)
      const currentStartDx = distToStart(currentRect);
      const closestStartDx = distToStart(closestRect);
      if (currentStartDx !== closestStartDx) {
        return currentStartDx < closestStartDx ? current : closest;
      }

      // سپس نزدیکی به مرکز افقی را در نظر بگیر
      const currentCenterX = currentRect.left + currentRect.width / 2;
      const closestCenterX = closestRect.left + closestRect.width / 2;
      const currentCenterDx = Math.abs(point.x - currentCenterX);
      const closestCenterDx = Math.abs(point.x - closestCenterX);
      if (currentCenterDx !== closestCenterDx) {
        return currentCenterDx < closestCenterDx ? current : closest;
      }

      // تساوی: المانی که مساحت کوچکتری دارد (اغلب داخلی‌تر است) را ترجیح بده
      const currentArea = currentRect.width * currentRect.height;
      const closestArea = closestRect.width * closestRect.height;
      return currentArea < closestArea ? current : closest;
    }, horizontallyContaining[0]);
  }

  // 2) در غیر این صورت، کمینه فاصله افقی تا لبه‌های رکت را معیار قرار بده
  return validChildren.reduce((closest, current) => {
    const currentRect = current.getBoundingClientRect();
    const closestRect = closest.getBoundingClientRect();

    const currentDx = Math.min(
      Math.abs(point.x - currentRect.left),
      Math.abs(point.x - currentRect.right)
    );
    const closestDx = Math.min(
      Math.abs(point.x - closestRect.left),
      Math.abs(point.x - closestRect.right)
    );

    // ابتدا فاصله تا لبه شروع را ترجیح بده
    const currentStartDx = distToStart(currentRect);
    const closestStartDx = distToStart(closestRect);
    if (currentStartDx !== closestStartDx) {
      return currentStartDx < closestStartDx ? current : closest;
    }

    if (currentDx !== closestDx) {
      return currentDx < closestDx ? current : closest;
    }

    // تساوی: کمینه فاصله عمودی به مرکز را هم در نظر بگیر
    const currentCenterY = currentRect.top + currentRect.height / 2;
    const closestCenterY = closestRect.top + closestRect.height / 2;
    const currentDy = Math.abs(point.y - currentCenterY);
    const closestDy = Math.abs(point.y - closestCenterY);
    if (currentDy !== closestDy) {
      return currentDy < closestDy ? current : closest;
    }

    // تساوی نهایی: کوچک‌تر بودن مساحت را ترجیح بده (اغلب داخلی‌تر)
    const currentArea = currentRect.width * currentRect.height;
    const closestArea = closestRect.width * closestRect.height;
    return currentArea < closestArea ? current : closest;
  }, validChildren[0]);
}

/**
 * Returns the closest block element by element that does not contain the page element and note element.
 */
export function getClosestBlockComponentByElement(
  element: Element | null
): BlockComponent | null {
  if (!element) return null;
  if (hasBlockId(element) && isBlock(element)) {
    return element;
  }
  const blockComponent = element.closest<BlockComponent>(ATTR_SELECTOR);
  if (blockComponent && isBlock(blockComponent)) {
    return blockComponent;
  }
  return null;
}

/**
 * Returns rect of the block element.
 *
 * Compatible with Safari!
 * https://github.com/toeverything/blocksuite/issues/902
 * https://github.com/toeverything/blocksuite/pull/1121
 */
export function getRectByBlockComponent(element: Element | BlockComponent) {
  if (!isDatabase(element)) element = element.firstElementChild ?? element;
  return element.getBoundingClientRect();
}

/**
 * Returns block elements excluding their subtrees.
 * Only keep block elements of same level.
 */
export function getBlockComponentsExcludeSubtrees(
  elements: BlockComponent[]
): BlockComponent[] {
  if (elements.length <= 1) return elements as BlockComponent[];

  const getLevel = (element: BlockComponent) => {
    let level = 0;
    let model: BlockModel | null = element.model;

    while (model && model.role !== 'root') {
      level++;
      model = model.parent;
    }

    return level;
  };

  let topMostLevel = Number.POSITIVE_INFINITY;
  const levels = elements.map(element => {
    const level = getLevel(element);

    topMostLevel = Math.min(topMostLevel, level);
    return level;
  });

  return elements.filter((_, index) => {
    return levels[index] === topMostLevel;
  }) as BlockComponent[];
}

/**
 * Find block element from an `Element[]`.
 * In Chrome/Safari, `document.elementsFromPoint` does not include `affine-image`.
 */
function findBlockComponent(elements: Element[], parent?: Element) {
  const len = elements.length;
  let element = null;
  let i = 0;
  while (i < len) {
    element = elements[i];
    i++;
    // if parent does not contain element, it's ignored
    if (parent && !contains(parent, element)) continue;
    if (hasBlockId(element) && isBlock(element)) return element;
    if (isImage(element)) {
      const element = elements[i];
      if (!element) return null;
      if (hasBlockId(element) && isBlock(element)) return element;
      return getClosestBlockComponentByElement(element);
    }
  }
  return null;
}

/**
 * Gets the rows of the database.
 */
function getDatabaseBlockRowsElement(element: Element) {
  return element.querySelector('.affine-database-block-rows');
}
