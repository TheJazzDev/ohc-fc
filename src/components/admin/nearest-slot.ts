export type BoardPoint = { left: number; top: number };

/**
 * Index of the slot closest to a point, both given in percentages of the
 * board's own box.
 *
 * A percent of width and a percent of height are different real distances on a
 * pitch that isn't square, so horizontal offsets are scaled by `aspect`
 * (board width ÷ height) before comparing. Without that, a drop between a
 * side-by-side pair and a stacked pair would pick the wrong one.
 *
 * Returns null only when there are no slots to choose from.
 */
export function nearestSlot(point: BoardPoint, slots: BoardPoint[], aspect: number): number | null {
  let best: number | null = null;
  let bestDistance = Infinity;

  for (let index = 0; index < slots.length; index++) {
    const dx = (point.left - slots[index].left) * aspect;
    const dy = point.top - slots[index].top;
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  }

  return best;
}
