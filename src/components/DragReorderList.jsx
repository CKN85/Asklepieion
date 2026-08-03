import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

// A plain HTML5-drag-and-drop reorderable list — no extra dependency, since
// the project otherwise has none of the usual drag-and-drop libraries
// installed. Good enough for an admin screen used with a mouse; native HTML5
// drag events don't fire reliably on touch, which is a known, accepted
// limitation here rather than an oversight.
//
// `items` is rendered in the order given. Dropping item A onto item B moves
// A to B's position; `onReorder` is called with the whole new array so the
// caller can both update local state immediately (for instant feedback) and
// persist the new order.
export default function DragReorderList({ items, getId, onReorder, renderItem, className }) {
  const [draggedId, setDraggedId] = useState(null);
  const [overId, setOverId] = useState(null);

  const handleDrop = (targetId) => {
    if (draggedId && draggedId !== targetId) {
      const fromIdx = items.findIndex((item) => getId(item) === draggedId);
      const toIdx = items.findIndex((item) => getId(item) === targetId);
      if (fromIdx !== -1 && toIdx !== -1) {
        const next = items.slice();
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        onReorder(next);
      }
    }
    setDraggedId(null);
    setOverId(null);
  };

  return (
    <div className={className}>
      {items.map((item) => {
        const id = getId(item);
        const isDragged = draggedId === id;
        const isOver = overId === id && draggedId && draggedId !== id;
        return (
          <div
            key={id}
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDraggedId(id); }}
            onDragOver={(e) => { e.preventDefault(); if (overId !== id) setOverId(id); }}
            onDragLeave={() => setOverId((o) => (o === id ? null : o))}
            onDrop={(e) => { e.preventDefault(); handleDrop(id); }}
            onDragEnd={() => { setDraggedId(null); setOverId(null); }}
            className="flex items-center gap-2"
            style={{
              opacity: isDragged ? 0.4 : 1,
              borderTop: isOver ? '2px solid #3F8A66' : '2px solid transparent',
              transition: 'opacity 0.15s ease',
            }}
          >
            <span
              className="text-[#2A2620] hover:text-[#3A3530] shrink-0"
              style={{ cursor: 'grab', touchAction: 'none' }}
              title="Drag to reorder"
            >
              <GripVertical size={13} />
            </span>
            <div className="flex-1 min-w-0">{renderItem(item)}</div>
          </div>
        );
      })}
    </div>
  );
}
