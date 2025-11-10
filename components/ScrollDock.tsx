import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DragHandle } from './DragHandle';
import { UpArrowIcon, DownArrowIcon, EyeOpenIcon, EyeClosedIcon } from './icons';

const ScrollDock: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isFaded, setIsFaded] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isInitialized, setIsInitialized] = useState(false); // New state to prevent initial flicker
    const dockRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef({ x: 0, y: 0 });
    const inactivityTimerRef = useRef<number | null>(null);

    // Set initial position on mount
    useEffect(() => {
        if (dockRef.current) {
            const dockWidth = dockRef.current.offsetWidth;
            const dockHeight = dockRef.current.offsetHeight;
            const margin = 32;
            setPosition({
                x: window.innerWidth - dockWidth - margin,
                y: window.innerHeight - dockHeight - margin,
            });
            // Mark as initialized to smoothly fade it in
            setIsInitialized(true);
        }
    }, []);
    
    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, []);

    const handleScrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleScrollToBottom = useCallback(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }, []);

    const handleToggleVisibility = useCallback(() => {
        setIsVisible(prev => !prev);
    }, []);

    const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        if (dockRef.current) {
            const rect = dockRef.current.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            offsetRef.current = {
                x: clientX - rect.left,
                y: clientY - rect.top,
            };
        }
    }, []);

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging || !dockRef.current) return;
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        let newX = clientX - offsetRef.current.x;
        let newY = clientY - offsetRef.current.y;
        
        const dockWidth = dockRef.current.offsetWidth;
        const dockHeight = dockRef.current.offsetHeight;

        // Clamp position within viewport boundaries
        newX = Math.max(0, Math.min(newX, window.innerWidth - dockWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - dockHeight));

        setPosition({ x: newX, y: newY });
    }, [isDragging]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);

        if (dockRef.current) {
            const dockWidth = dockRef.current.offsetWidth;
            const dockHeight = dockRef.current.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const SNAP_MARGIN_PX = 16; // 1rem

            setPosition(currentPos => {
                const distLeft = currentPos.x;
                const distRight = viewportWidth - (currentPos.x + dockWidth);

                // Preserve vertical position, but clamp it to stay within viewport with a margin
                const newY = Math.max(SNAP_MARGIN_PX, Math.min(currentPos.y, viewportHeight - dockHeight - SNAP_MARGIN_PX));
                
                // Always snap horizontally to the nearest side
                const newX = distLeft < distRight 
                    ? SNAP_MARGIN_PX 
                    : viewportWidth - dockWidth - SNAP_MARGIN_PX;
                
                return { x: newX, y: newY };
            });
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        setIsFaded(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        inactivityTimerRef.current = window.setTimeout(() => {
            setIsFaded(true);
        }, 7000); // 7 seconds
    }, []);


    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('touchmove', handleDragMove, { passive: false });
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleDragMove);
            document.removeEventListener('touchmove', handleDragMove);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Conditional classes to handle visibility and animations
    const getOpacityClass = () => {
        if (!isInitialized) return 'opacity-0'; // Stay hidden until positioned
        if (isVisible) return isFaded ? 'opacity-10' : 'opacity-100';
        return 'opacity-0 pointer-events-none'; // Make it completely invisible and non-interactive
    };

    const dockClasses = `
        fixed z-[2147483647] flex flex-col items-center gap-2 rounded-xl p-2
        bg-slate-800/80 backdrop-blur-md shadow-2xl shadow-black/50
        transition-all duration-300
        ${!isDragging ? 'transition-[top,left] duration-300 ease-out' : ''}
        ${getOpacityClass()}
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
    `;

    const buttonClasses = `
        w-9 h-9 rounded-lg font-bold shadow-md text-white
        transition-all duration-200 ease-in-out
        cursor-pointer flex items-center justify-center flex-shrink-0
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400
        hover:scale-110 hover:brightness-125
    `;

    // A separate button to bring the dock back
    const showButtonClasses = `
        fixed z-[2147483647] p-2 rounded-full
        bg-slate-800/80 backdrop-blur-md shadow-2xl shadow-black/50
        transition-opacity duration-300
        ${isVisible ? 'opacity-0 pointer-events-none' : 'opacity-50 hover:opacity-100'}
    `;

    return (
        <>
            <div
                ref={dockRef}
                id="draggable-controls"
                className={dockClasses}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <DragHandle onMouseDown={handleDragStart} onTouchStart={handleDragStart} isDragging={isDragging} />

                <button
                    onClick={handleScrollToTop}
                    className={`${buttonClasses} bg-blue-600 hover:bg-blue-500`}
                    aria-label="Scroll to Top"
                >
                    <UpArrowIcon />
                </button>

                <button
                    onClick={handleScrollToBottom}
                    className={`${buttonClasses} bg-green-600 hover:bg-green-500`}
                    aria-label="Scroll to Bottom"
                >
                    <DownArrowIcon />
                </button>

                <button
                    onClick={handleToggleVisibility}
                    className={`${buttonClasses} bg-gray-600 hover:bg-gray-500`}
                    aria-label="Hide Dock"
                >
                    <EyeClosedIcon />
                </button>
            </div>
             {/* This button appears when the dock is hidden */}
            <button
                onClick={handleToggleVisibility}
                className={showButtonClasses}
                style={{ left: `${position.x + 8}px`, top: `${position.y + 8}px` }}
                aria-label="Show Dock"
            >
                <EyeOpenIcon />
            </button>
        </>
    );
};

export default ScrollDock;