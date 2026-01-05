import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const normalizeBase = (value: string) => (value.endsWith('/') ? value : `${value}/`);
const base = normalizeBase(process.env.BASE_URL || '/');

export default defineConfig({
  base,
  plugins: [react()],
});
