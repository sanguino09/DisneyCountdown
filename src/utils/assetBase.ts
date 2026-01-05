const normalizeBase = (base?: string) => {
  if (!base) return '/';
  return base.endsWith('/') ? base : `${base}/`;
};

export const assetBase = normalizeBase(import.meta.env.BASE_URL);

export const withBase = (path: string) => `${assetBase}${path.replace(/^\//, '')}`;
