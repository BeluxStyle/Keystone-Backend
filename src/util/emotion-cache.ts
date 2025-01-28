// /utils/emotion-cache.ts
import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// Crea un caché compatible con SSR
export const createEmotionCache = () =>
  createCache({ key: 'css', prepend: true });
