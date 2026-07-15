import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface Props {
  id: string;
  children: React.ReactNode;
  isEditMode: boolean;
  onHide?: (id: string) => void;
  className?: string;
}

export function WidgetWrapper({ id, children, isEditMode, onHide, className = '' }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative h-full transition-all duration-300 ${isEditMode ? 'ring-2 ring-primary/50 ring-offset-4 ring-offset-black rounded-3xl opacity-90 hover:opacity-100' : ''} ${isDragging ? 'scale-[1.02] shadow-2xl shadow-primary/20 ring-primary' : ''} ${className}`}
    >
      {isEditMode && (
        <>
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-md rounded-lg text-white/50 cursor-grab active:cursor-grabbing hover:text-white border border-white/10 hover:border-white/20 transition-all shadow-lg"
          >
            <GripVertical size={16} />
          </div>

          {/* Action Menu / Hide */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onHide) onHide(id);
              }}
              className="p-2 bg-black/80 backdrop-blur-md rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition-all shadow-lg"
              title="Hide Widget"
            >
              <X size={16} />
            </button>
          </div>
        </>
      )}

      {/* Widget Content */}
      <div className={`h-full ${isEditMode ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
}
