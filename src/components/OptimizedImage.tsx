import { memo, useEffect, useRef, useState } from "react";


const OptimizedImage = memo(({ src, alt, className }: { src: string ; alt: string; className?: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
  
    useEffect(() => {
      if (imageRef.current?.complete) {
        setIsLoaded(true);
      }
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && imageRef.current) {
              imageRef.current.src = src;
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
  
      if (imageRef.current) {
        observer.observe(imageRef.current);
      }
  
      return () => observer.disconnect();
    }, [src]);
  
    return (
      <div className={`relative ${className}`}>
        <img
      
          ref={imageRef}
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // Placeholder
          data-src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        {!isLoaded && (
          <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
        )}
      </div>
    );
  });
  OptimizedImage.displayName = 'OptimizedImage';

  export default OptimizedImage