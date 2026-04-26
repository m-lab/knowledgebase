import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  integrations: [svelte()],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: false,
    },
  },
});
