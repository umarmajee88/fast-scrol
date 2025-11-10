import React from 'react';

interface DragHandleProps {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
    isDragging: boolean;
}

const Dot: React.FC = () => <div className="w-1 h-1 bg-white/60 rounded-full" />;

export const DragHandle: React.FC<DragHandleProps> = ({ onMouseDown, onTouchStart, isDragging }) => (
    <div
        id="drag-handle"
        title="Drag to reposition"
        // Using a slightly wider container and CSS gap for more precise and modern layout.
        className={`w-7 flex flex-col items-center justify-center p-1 mb-1 touch-none gap-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
    >
        {/* A 2x3 grid of dots for the handle, now using gap for consistent spacing. */}
        <div className="flex gap-1">
            <Dot />
            <Dot />
            <Dot />
        </div>
        <div className="flex gap-1">
            <Dot />
            <Dot />
            <Dot />
        </div>
    </div>
);
