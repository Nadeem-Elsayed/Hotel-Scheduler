import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['sqlite3'],
    },
  },
  resolve: {
    // Some forge configurations have a mainFields array here, leave it as is if you do
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});