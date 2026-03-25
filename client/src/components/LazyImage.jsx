import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LazyImage = ({ src, alt, className = '', fallback = null }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isAbsolute = src?.startsWith('http') || src?.startsWith('blob:') || src?.startsWith('data:');
  const fullSrc = isAbsolute ? src : src ? `${BASE_URL}${src}` : null;

  if (!fullSrc || error) {
    return fallback || (
      <div
        className={`${className} flex items-center justify-center text-xs`}
        style={{ background: 'var(--elevated)', color: 'var(--text-muted)' }}
      >
        No Image
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={fullSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ borderRadius: 'inherit' }}
      />
    </div>
  );
};

export default LazyImage;
