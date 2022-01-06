import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vitejs-plugin-electron';
import pkg from '../../package.json';

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  mode: process.env.NODE_ENV,
  plugins: [vue(), electron()],
  base: './',
  build: {
    assetsDir: '',
    emptyOutDir: true,
    minify: false,
    outDir: '../../dist/renderer',
    rollupOptions: {
      external: [...electron.externals, 'electron'],
      output: {
        format: 'cjs',
      },
    },
  },
  optimizeDeps: {
    exclude: ['electron'],
  },
  server: {
    fs: {
      strict: false,
    },
    host: pkg.env.HOST,
    port: pkg.env.PORT,
    proxy: {
      // 选项写法
      '/dav': {
        target: 'https://dav.jianguoyun.com',
        changeOrigin: true,
      },
      // 选项写法
      '/dev-webdav': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: () => '/',
      },
    },
  },
});
