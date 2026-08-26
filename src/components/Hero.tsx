'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(-150);
  const [scaleValue, setScaleValue] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [localTime, setLocalTime] = useState('');

  // Local Time logic (Hanoi Local Time context)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Draggable Ruler logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX - translateX);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startX;
    
    // Bounds for scrolling/dragging
    const minX = -450;
    const maxX = 150;
    const boundedX = Math.max(minX, Math.min(maxX, newX));
    
    setTranslateX(boundedX);
    
    // Calculate percentage (0 - 100) based on bounds
    const totalRange = maxX - minX;
    const currentOffset = boundedX - minX;
    const percentage = Math.round((currentOffset / totalRange) * 100);
    setScaleValue(percentage);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setStartX(touch.clientX - translateX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - startX;
    const minX = -450;
    const maxX = 150;
    const boundedX = Math.max(minX, Math.min(maxX, newX));
    setTranslateX(boundedX);
    
    const totalRange = maxX - minX;
    const currentOffset = boundedX - minX;
    const percentage = Math.round((currentOffset / totalRange) * 100);
    setScaleValue(percentage);
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-[#111111] bg-grid-paper select-none text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Local time and metadata */}
        <div className="flex justify-between items-center border-b border-[#111111] pb-6 mb-8 md:mb-12 font-mono text-xs uppercase tracking-widest text-[#111111]/70">
          <div>Creative Practice / Hanoi, VN</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#111111] animate-pulse-soft"></span>
            Hanoi: {localTime || '12:00 PM'}
          </div>
        </div>

        {/* Hero Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
          <div className="md:col-span-8">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              Why are developer portfolios <span className="italic text-stroke font-normal">still stuck</span> in 2020?
            </h1>
          </div>
          <div className="md:col-span-4 md:pl-6 flex flex-col justify-between h-full pt-2">
            <p className="font-sans text-sm md:text-base leading-relaxed text-[#111111]/85 mb-8">
              Portfol.io is a curated platform for creators. We believe every portfolio begins with intention—sketched on craft paper, refined with care, and built to last. We shape your work into a premium, editorial presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signin" 
                className="bg-[#111111] text-[#F7F4EF] hover:bg-[#111111]/85 transition-colors px-6 py-3 text-center font-mono text-xs uppercase tracking-widest rounded-sm border border-[#111111]"
              >
                Get Started
              </Link>
              <Link 
                href="/works" 
                className="bg-transparent text-[#111111] hover:bg-[#111111]/5 transition-colors px-6 py-3 text-center font-mono text-xs uppercase tracking-widest rounded-sm border border-[#111111]"
              >
                Browse Works
              </Link>
            </div>
          </div>
        </div>

        {/* Draggable ruler micro-interaction */}
        <div className="border border-[#111111] bg-[#F7F4EF] rounded-sm p-6 relative overflow-hidden flex flex-col gap-4">
          <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest text-[#111111]/70">
            <div>Interactive Tool / Curiosity Index</div>
            <div className="text-right">Scale: <span className="text-[#111111] font-bold">{scaleValue}%</span></div>
          </div>

          {/* Draggable Container */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className={`h-24 border-y border-[#111111]/25 relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center bg-[#F7F4EF] transition-shadow ${isDragging ? 'shadow-inner' : ''}`}
          >
            {/* The ruler track */}
            <div 
              className="absolute left-1/2 flex items-end gap-1.5 h-16 w-max transition-transform duration-75 ease-out"
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {Array.from({ length: 120 }).map((_, i) => {
                const isMajor = i % 10 === 0;
                const isMedium = i % 5 === 0 && !isMajor;
                
                return (
                  <div key={i} className="flex flex-col items-center justify-end h-full w-2">
                    {isMajor && (
                      <span className="font-mono text-[9px] text-[#111111]/50 mb-1 select-none">
                        {i * 10}
                      </span>
                    )}
                    <div 
                      className="w-0.5 bg-[#111111] transition-all"
                      style={{ 
                        height: isMajor ? '28px' : isMedium ? '18px' : '10px',
                        opacity: isMajor ? 0.6 : isMedium ? 0.4 : 0.2
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Central indicator line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-sm" />
          </div>

          <div className="font-mono text-[10px] text-[#111111]/50 uppercase tracking-wider text-center">
            ← Drag the ruler to measure your curiosity limit →
          </div>
        </div>

      </div>
    </section>
  );
}
