import React, { useEffect, useRef, useState } from 'react';

interface DeferredRenderProps {
  children: React.ReactNode;
  minHeight?: number;
  rootMargin?: string;
}

/**
 * Delays mounting data-heavy, below-the-fold sections until the visitor gets
 * close to them. This avoids firing every home-page API request at once.
 */
const DeferredRender: React.FC<DeferredRenderProps> = ({
  children,
  minHeight = 320,
  rootMargin = '500px 0px',
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || !('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={anchorRef}
      style={shouldRender ? undefined : { minHeight }}
      className="content-auto"
    >
      {shouldRender ? children : null}
    </div>
  );
};

export default DeferredRender;
