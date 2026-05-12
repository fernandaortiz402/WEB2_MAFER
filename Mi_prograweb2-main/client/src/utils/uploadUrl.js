/**
 * Construye la URL pública de un archivo en /uploads.
 * En desarrollo, el proxy de CRA reenvía /uploads al backend.
 */
export function resolveUploadUrl(relativePath) {
  if (!relativePath) return '';
  if (typeof relativePath !== 'string') return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const base = (process.env.REACT_APP_API_ORIGIN || '').replace(/\/$/, '');
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return base ? `${base}${path}` : path;
}
