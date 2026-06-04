import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      // Tell Vite to completely ignore this native Node module
      external: ['sqlite3'],
    },
  },
  resolve: {
    // Some forge configurations have a mainFields array here, leave it as is if you do
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});