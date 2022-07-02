import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: process.env.BASE_URL || '/',
    plugins: [vue(), vueJsx()],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/swagger': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/file': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: 'esbuild',
    },
    define: {
      '__VERSION__': command == 'build' ? '"' + require('child_process').execSync('git describe --always --tags --abbrev=8').toString().trim() + '"' : '"dev"',
    },
  };
});
