const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_ROOT = API_BASE_URL.replace(/\/api\/?$/, '');

export function getImageUrl(filePath) {
  if (!filePath) {
    return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
  }

  // If passed a photo object directly
  if (typeof filePath === 'object') {
    filePath =
      filePath.file_path ||
      filePath.url ||
      filePath.image_url ||
      filePath.path ||
      filePath.photo_url ||
      filePath.filename;
    if (!filePath) {
      return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=800&auto=format&fit=crop';
    }
  }

  if (
    filePath.startsWith('http://') ||
    filePath.startsWith('https://') ||
    filePath.startsWith('blob:') ||
    filePath.startsWith('data:')
  ) {
    return filePath;
  }

  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${BACKEND_ROOT}${cleanPath}`;
}

export default getImageUrl;
