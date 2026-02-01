import React, { useId, useRef, useState, useEffect } from 'react';

interface LiquidTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export const LiquidText: React.FC<LiquidTextProps> = ({ children, className = '', as: Tag = 'div' }) => {
  // Generate a unique ID for each instance to prevent filter conflicts
  const id = useId();
  const filterId = `liquid-filter-${id}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Use IntersectionObserver to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '50px' } // Small buffer for smoother transitions
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={filterId}>
            {/* 
              Higher frequency (0.04) = finer noise 
              Animation only runs when visible
              Slower duration (0.5s) for reduced CPU usage
            */}
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="1" result="turbulence">
              {isVisible && (
                <animate
                  attributeName="baseFrequency"
                  dur="0.5s"
                  values="0.04;0.045;0.04"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" />
          </filter>
        </defs>
      </svg>
      {/* Apply a slight blur and the displacement for that "ink bleeding / tearing" look */}
      <Tag className={`${className} transition-all duration-300`} style={{ filter: `url(#${filterId})` }}>
        {children}
      </Tag>
    </div>
  );
};