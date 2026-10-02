const API_ORIGIN = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, ''); // strip trailing /api

/**
 * Resolve a stored image path into an absolute URL.
 * - "http://..." → returned as-is
 * - "/uploads/..." → prefixed with backend origin
 * - "" → returns ""
 */
function resolveImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`;
  return path;
}

export default function Avatar({ user, size = 'md', ring = true }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const initials =
    (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '') || '?';

  const src = resolveImageUrl(user?.profileImage);

  if (src) {
    return (
      <img
        src={src}
        alt={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
        className={`${sizes[size]} rounded-full object-cover bg-cream ${
          ring ? 'ring-4 ring-brand-100' : ''
        }`}
        onError={(e) => {
          // If image fails (e.g., file deleted), fall back to initials
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling?.style?.setProperty('display', 'flex');
        }}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-500 to-brand-700
                  flex items-center justify-center text-white font-bold
                  ${ring ? 'ring-4 ring-brand-100' : ''}`}
    >
      {initials.toUpperCase()}
    </div>
  );
}