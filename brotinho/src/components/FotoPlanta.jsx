import { Leaf } from 'lucide-react';

export default function FotoPlanta({ src, alt, className = '' }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-sage dark:bg-forest-light ${className}`}
        role="img"
        aria-label={`Foto indisponível para ${alt}`}
      >
        <Leaf className="w-8 h-8 text-moss/60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  );
}
