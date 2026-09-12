"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { nearestSlot, type BoardPoint } from "./nearest-slot";

// `over` is the slot that would receive the drop, or null while the pointer is
// off the pitch — where releasing cancels instead.
export type SlotDrag = { from: number; left: number; top: number; over: number | null };

/**
 * Drag-to-reposition for the admin pitch.
 *
 * Tracking happens on `window` rather than on the shirt itself, so the drag
 * survives the pointer leaving the element and still finishes if the browser
 * never grants pointer capture. Capture is requested as a best effort on top,
 * which is what keeps touch dragging smooth.
 */
export function useSlotDrag({
  boardRef,
  slots,
  aspect,
  onDrop,
}: {
  boardRef: RefObject<HTMLDivElement | null>;
  slots: BoardPoint[];
  aspect: number;
  onDrop: (from: number, to: number) => void;
}) {
  const [drag, setDrag] = useState<SlotDrag | null>(null);
  const dragRef = useRef<SlotDrag | null>(null);
  const dragging = drag !== null;

  // The listeners below live for the length of a drag, so read moving values
  // through refs instead of resubscribing on every pointer move.
  const slotsRef = useRef(slots);
  const onDropRef = useRef(onDrop);
  useEffect(() => {
    slotsRef.current = slots;
    onDropRef.current = onDrop;
  });

  function readPoint(clientX: number, clientY: number) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return {
      left: ((clientX - rect.left) / rect.width) * 100,
      top: ((clientY - rect.top) / rect.height) * 100,
      inside: clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom,
    };
  }

  function startDrag(index: number, event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const point = readPoint(event.clientX, event.clientY);
    if (!point) return;
    event.preventDefault();
    // Best effort: a synthetic or already-released pointer can't be captured.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Window listeners below still see the drag through.
    }
    const next = { from: index, left: point.left, top: point.top, over: index };
    dragRef.current = next;
    setDrag(next);
  }

  useEffect(() => {
    if (!dragging) return;

    function handleMove(event: globalThis.PointerEvent) {
      const current = dragRef.current;
      const point = readPoint(event.clientX, event.clientY);
      if (!current || !point) return;
      const over = point.inside ? nearestSlot(point, slotsRef.current, aspect) : null;
      const next = { from: current.from, left: point.left, top: point.top, over };
      dragRef.current = next;
      setDrag(next);
    }

    function handleUp(event: globalThis.PointerEvent) {
      const current = dragRef.current;
      dragRef.current = null;
      setDrag(null);
      if (!current) return;
      const point = readPoint(event.clientX, event.clientY);
      // Released off the pitch: cancel, so a fumbled drag can't empty a slot.
      const target = point?.inside ? nearestSlot(point, slotsRef.current, aspect) : null;
      if (target !== null && target !== current.from) onDropRef.current(current.from, target);
    }

    function handleCancel() {
      dragRef.current = null;
      setDrag(null);
    }

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, aspect]);

  return { drag, startDrag };
}
